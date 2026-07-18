import { API_BASE_URL } from '../api/client'

export type BackendStatus = 'sleeping' | 'waking' | 'online' | 'error'

/** Delay between failed health checks (ms). */
export const WAKEUP_RETRY_INTERVAL_MS = 5_000

/** Maximum health-check attempts before marking the backend unavailable. */
export const WAKEUP_MAX_RETRIES = 12

/** Per-request timeout — Render cold starts can take a while. */
export const WAKEUP_REQUEST_TIMEOUT_MS = 45_000

type StatusListener = (status: BackendStatus) => void

function isDev(): boolean {
  return import.meta.env.DEV
}

function log(...args: unknown[]): void {
  if (isDev()) {
    console.log('[backend-wakeup]', ...args)
  }
}

function resolveHealthUrl(): string {
  // Prefer configured API origin; fall back to relative path (Vite proxy) or known Render URL.
  const base =
    API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? ''
      : 'https://websiteb-backend.onrender.com')
  return `${base}/api/health`
}

async function pingHealth(signal: AbortSignal): Promise<boolean> {
  const res = await fetch(resolveHealthUrl(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
    credentials: 'omit',
    cache: 'no-store',
  })
  return res.status === 200
}

/**
 * Singleton wake-up service for Render Free cold starts.
 * Only one wake loop runs app-wide; all subscribers share the same status.
 */
class BackendWakeupService {
  private status: BackendStatus = 'sleeping'
  private listeners = new Set<StatusListener>()
  private running = false
  private abortController: AbortController | null = null
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private attempt = 0

  getStatus(): BackendStatus {
    return this.status
  }

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    listener(this.status)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private setStatus(next: BackendStatus): void {
    if (this.status === next) return
    this.status = next
    for (const listener of this.listeners) {
      listener(next)
    }
  }

  private clearRetryTimer(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
  }

  private cancelInFlight(): void {
    this.abortController?.abort()
    this.abortController = null
  }

  /** Start (or no-op if already running / online). */
  start(): void {
    if (this.status === 'online') return
    if (this.running) return

    this.running = true
    this.attempt = 0
    this.clearRetryTimer()
    this.setStatus('waking')
    log('Backend wake-up started')
    void this.runAttempt()
  }

  /** Restart wake-up after an error (Retry button). */
  retry(): void {
    this.cancelInFlight()
    this.clearRetryTimer()
    this.running = false
    this.attempt = 0
    this.setStatus('sleeping')
    this.start()
  }

  private scheduleRetry(): void {
    this.clearRetryTimer()
    log('Retrying...')
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null
      void this.runAttempt()
    }, WAKEUP_RETRY_INTERVAL_MS)
  }

  private async runAttempt(): Promise<void> {
    if (!this.running) return
    if (this.status === 'online') return

    this.attempt += 1
    log('Attempt number', this.attempt)

    this.cancelInFlight()
    const controller = new AbortController()
    this.abortController = controller
    const timeout = setTimeout(() => controller.abort(), WAKEUP_REQUEST_TIMEOUT_MS)

    try {
      const ok = await pingHealth(controller.signal)
      clearTimeout(timeout)

      if (ok) {
        this.running = false
        this.clearRetryTimer()
        this.setStatus('online')
        log('Backend online')
        return
      }

      throw new Error(`Health check returned non-200`)
    } catch {
      clearTimeout(timeout)
      if (controller.signal.aborted && this.abortController !== controller) {
        // Superseded by a newer attempt / retry()
        return
      }

      if (this.attempt >= WAKEUP_MAX_RETRIES) {
        this.running = false
        this.clearRetryTimer()
        this.setStatus('error')
        log('Backend unavailable')
        return
      }

      this.setStatus('waking')
      this.scheduleRetry()
    }
  }
}

export const backendWakeup = new BackendWakeupService()
