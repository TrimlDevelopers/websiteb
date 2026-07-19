import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  backendWakeup,
  type BackendStatus,
  WAKEUP_MAX_RETRIES,
  WAKEUP_RETRY_INTERVAL_MS,
} from '../services/backendWakeup'

interface BackendStatusContextValue {
  status: BackendStatus
  isOnline: boolean
  isWaking: boolean
  isUnavailable: boolean
  /** Begin health checks only when a consumer needs the API (contact form intent). */
  ensureReady: () => void
  retry: () => void
  retryIntervalMs: number
  maxRetries: number
}

const BackendStatusContext = createContext<BackendStatusContextValue | null>(null)

export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<BackendStatus>(() => backendWakeup.getStatus())

  useEffect(() => backendWakeup.subscribe(setStatus), [])

  const ensureReady = useCallback(() => {
    backendWakeup.start()
  }, [])

  const value = useMemo<BackendStatusContextValue>(
    () => ({
      status,
      isOnline: status === 'online',
      isWaking: status === 'waking',
      isUnavailable: status === 'error',
      ensureReady,
      retry: () => backendWakeup.retry(),
      retryIntervalMs: WAKEUP_RETRY_INTERVAL_MS,
      maxRetries: WAKEUP_MAX_RETRIES,
    }),
    [status, ensureReady],
  )

  return (
    <BackendStatusContext.Provider value={value}>{children}</BackendStatusContext.Provider>
  )
}

export function useBackendStatus(): BackendStatusContextValue {
  const ctx = useContext(BackendStatusContext)
  if (!ctx) {
    throw new Error('useBackendStatus must be used within BackendStatusProvider')
  }
  return ctx
}
