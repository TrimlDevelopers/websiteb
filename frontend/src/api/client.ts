const rawBase = import.meta.env.VITE_API_URL ?? ''

/** Backend origin with no trailing slash. Empty in local dev (uses Vite proxy). */
export const API_BASE_URL = String(rawBase).replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalized}`
}

type JsonBody = object | unknown[] | null

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { json?: JsonBody } = {},
): Promise<T> {
  const { json, headers, ...rest } = options

  const res = await fetch(buildUrl(path), {
    ...rest,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  let data: unknown = null
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    data = await res.json()
  } else {
    data = await res.text()
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error: unknown }).error === 'string'
          ? (data as { error: string }).error
          : `Request failed with status ${res.status}`

    throw new ApiError(message, res.status, data)
  }

  return data as T
}

export function apiGet<T>(path: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'GET' })
}

export function apiPost<T>(path: string, json?: JsonBody, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'POST', json })
}

export function apiPatch<T>(path: string, json?: JsonBody, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'PATCH', json })
}

export function apiDelete<T>(path: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'DELETE' })
}
