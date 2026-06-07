import { Pool } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL

export const dbPool = connectionString ? new Pool({ connectionString }) : null

if (dbPool) {
  dbPool.on('error', (error: any) => {
    // Keep process alive; transient websocket/network errors are handled by retrying queries per request.
    console.error('[dbPool] idle client error:', error?.message || error)
  })
}

export function requireDbPool() {
  if (!dbPool) throw new Error('DATABASE_URL not configured')
  return dbPool
}

