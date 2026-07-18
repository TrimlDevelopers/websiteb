import {
  createContext,
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
  retry: () => void
  retryIntervalMs: number
  maxRetries: number
}

const BackendStatusContext = createContext<BackendStatusContextValue | null>(null)

export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<BackendStatus>(() => backendWakeup.getStatus())

  useEffect(() => {
    const unsubscribe = backendWakeup.subscribe(setStatus)
    backendWakeup.start()
    return unsubscribe
  }, [])

  const value = useMemo<BackendStatusContextValue>(
    () => ({
      status,
      isOnline: status === 'online',
      isWaking: status === 'sleeping' || status === 'waking',
      isUnavailable: status === 'error',
      retry: () => backendWakeup.retry(),
      retryIntervalMs: WAKEUP_RETRY_INTERVAL_MS,
      maxRetries: WAKEUP_MAX_RETRIES,
    }),
    [status],
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
