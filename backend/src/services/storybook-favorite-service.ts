import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const storybookFavoriteService = {
  async add(userId: string, storybookId: number) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `INSERT INTO storybook_favorites (user_id, storybook_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, storybook_id) DO NOTHING
       RETURNING *`,
      [userId, storybookId]
    )
    return result.rows[0] || null
  },

  async remove(userId: string, storybookId: number) {
    const db = requirePool()
    await queryWithRetry(
      db,
      `DELETE FROM storybook_favorites WHERE user_id = $1 AND storybook_id = $2`,
      [userId, storybookId]
    )
    return { success: true }
  },

  async list(userId: string) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `SELECT sf.storybook_id
       FROM storybook_favorites sf
       WHERE sf.user_id = $1`,
      [userId]
    )
    return result.rows.map((row: any) => Number(row.storybook_id))
  }
}

