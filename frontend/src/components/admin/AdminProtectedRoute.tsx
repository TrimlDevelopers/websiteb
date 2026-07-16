import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { fetchAdminMe } from '../../api/adminAuth'
import { ApiError } from '../../api/client'

interface AdminProtectedRouteProps {
  children: ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation()
  const [status, setStatus] = useState<'loading' | 'ok' | 'deny'>('loading')

  useEffect(() => {
    let cancelled = false

    fetchAdminMe()
      .then(() => {
        if (!cancelled) setStatus('ok')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof ApiError && (error.status === 401 || error.status === 503)) {
          setStatus('deny')
          return
        }
        setStatus('deny')
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Checking admin session…
      </div>
    )
  }

  if (status === 'deny') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
