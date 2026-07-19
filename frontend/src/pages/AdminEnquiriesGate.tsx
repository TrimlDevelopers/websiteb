import { useEffect } from 'react'
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute'
import { useBackendStatus } from '../hooks/useBackendStatus'
import AdminEnquiriesPage from './AdminEnquiriesPage'

/** Keeps admin auth/protection out of the public shell bundle. */
export default function AdminEnquiriesGate() {
  const { ensureReady } = useBackendStatus()

  useEffect(() => {
    ensureReady()
  }, [ensureReady])

  return (
    <AdminProtectedRoute>
      <AdminEnquiriesPage />
    </AdminProtectedRoute>
  )
}
