import { Pool } from '@neondatabase/serverless'

type RetryOptions = {
  retries?: number
  baseDelayMs?: number
}

const RETRYABLE_CODES = new Set([
  '57P01', // admin_shutdown
  '57P02', // crash_shutdown
  '57P03', // cannot_connect_now
  '53300', // too_many_connections
  '08000',
  '08003',
  '08006'
])

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryable(error: any) {
  const code = error?.code ? String(error.code) : ''
  const message = String(error?.message || '').toLowerCase()
  if (RETRYABLE_CODES.has(code)) return true
  return (
    message.includes('websocket') ||
    message.includes('connection terminated') ||
    message.includes('ecconnreset') ||
    message.includes('network') ||
    message.includes('fetch failed') ||
    message.includes('cannot_connect_now')
  )
}

export async function queryWithRetry(
  pool: Pool,
  sql: string,
  params: any[] = [],
  options: RetryOptions = {}
) {
  const retries = options.retries ?? 2
  const baseDelayMs = options.baseDelayMs ?? 120
  let attempt = 0
  let lastError: any = null

  while (attempt <= retries) {
    try {
      return await pool.query(sql, params)
    } catch (error: any) {
      lastError = error
      if (!isRetryable(error) || attempt === retries) break
      const delay = baseDelayMs * (attempt + 1)
      console.warn(`[db-retry] retrying query attempt=${attempt + 1} delay=${delay}ms reason=${error?.message || error}`)
      await sleep(delay)
      attempt += 1
    }
  }

  throw lastError
}
