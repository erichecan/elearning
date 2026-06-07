import { dbPool } from '../lib/db-pool'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const favoriteService = {
  async add(userId: string, wordId: number) {
    const db = requirePool()
    const result = await db.query(
      `INSERT INTO favorites (user_id, word_id, created_at)
       VALUES ($1,$2,NOW())
       ON CONFLICT (user_id, word_id) DO NOTHING
       RETURNING *`,
      [userId, wordId]
    )
    return result.rows[0] || null
  },

  async remove(userId: string, wordId: number) {
    const db = requirePool()
    await db.query(
      `DELETE FROM favorites WHERE user_id = $1 AND word_id = $2`,
      [userId, wordId]
    )
    return { success: true }
  },

  async getAll(userId: string) {
    const db = requirePool()
    const result = await db.query(
      `SELECT w.*, c.display_name AS category_display_name, c.icon AS category_icon, c.color AS category_color
       FROM favorites f
       JOIN words w ON w.id = f.word_id
       LEFT JOIN categories c ON c.id = w.category_id
       WHERE f.user_id = $1 AND w.is_active = true
       ORDER BY f.created_at DESC`,
      [userId]
    )
    return result.rows.map((row: any) => ({
      ...row,
      is_favorite: true
    }))
  }
}
