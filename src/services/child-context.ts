import { apiFetch } from './api-client'

const CHILD_ID_KEY = 'activeChildId'

export function getActiveChildId(): string | null {
  return localStorage.getItem(CHILD_ID_KEY)
}

export function setActiveChildId(childId: string) {
  localStorage.setItem(CHILD_ID_KEY, childId)
}

export async function fetchChildren() {
  const response = await apiFetch('/api/children')
  if (!response.ok) throw new Error('Failed to fetch children')
  return response.json() as Promise<Array<{ id: string; name: string }>>
}
