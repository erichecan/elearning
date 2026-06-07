const DEFAULT_BASE_URL = 'http://127.0.0.1:3001'

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || DEFAULT_BASE_URL

export function buildApiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = API_BASE_URL.replace(/\/$/, '')
  const next = path.startsWith('/') ? path : `/${path}`
  return `${base}${next}`
}

export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('adminToken') || ''
  const headers = new Headers(options?.headers || {})
  if (token) {
    headers.set('x-admin-token', token)
  }
  return fetch(buildApiUrl(path), { ...options, headers })
}
