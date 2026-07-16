import { apiGet, apiPost } from './client'

export interface AdminSession {
  username: string
  role?: string
}

export function adminLogin(
  username: string,
  password: string,
): Promise<{ success: boolean; message: string; admin: AdminSession }> {
  return apiPost('/api/admin/login', { username, password })
}

export function adminLogout(): Promise<{ success: boolean; message: string }> {
  return apiPost('/api/admin/logout', {})
}

export function fetchAdminMe(): Promise<{ success: boolean; admin: AdminSession }> {
  return apiGet('/api/admin/me')
}
