import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const wordQueryService = {
  async getById(id: number, userId?: string) {
    const db = requirePool()
    if (userId) {
      const result = await queryWithRetry(
        db,
        `SELECT w.*, c.display_name AS category_display_name, c.icon AS category_icon, c.color AS category_color,
                CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS is_favorite
         FROM words w
         LEFT JOIN categories c ON c.id = w.category_id
         LEFT JOIN favorites f ON f.word_id = w.id AND f.user_id = $2
         WHERE w.id = $1 AND w.is_active = true
         LIMIT 1`,
        [id, userId]
      )
      return result.rows[0] || null
    }

    const result = await queryWithRetry(
      db,
      `SELECT w.*, c.display_name AS category_display_name, c.icon AS category_icon, c.color AS category_color
       FROM words w
       LEFT JOIN categories c ON c.id = w.category_id
       WHERE w.id = $1 AND w.is_active = true
       LIMIT 1`,
      [id]
    )
    return result.rows[0] || null
  },

  async search(query: string, userId?: string) {
    const db = requirePool()
    const like = `%${query}%`
    if (userId) {
      const result = await queryWithRetry(
        db,
        `SELECT w.*, c.display_name AS category_display_name, c.icon AS category_icon, c.color AS category_color,
                CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS is_favorite
         FROM words w
         LEFT JOIN categories c ON c.id = w.category_id
         LEFT JOIN favorites f ON f.word_id = w.id AND f.user_id = $3
         WHERE w.is_active = true AND (w.word ILIKE $1 OR w.chinese ILIKE $2)
         ORDER BY w.id ASC
         LIMIT 50`,
        [like, like, userId]
      )
      return result.rows
    }

    const result = await queryWithRetry(
      db,
      `SELECT w.*, c.display_name AS category_display_name, c.icon AS category_icon, c.color AS category_color
       FROM words w
       LEFT JOIN categories c ON c.id = w.category_id
       WHERE w.is_active = true AND (w.word ILIKE $1 OR w.chinese ILIKE $2)
       ORDER BY w.id ASC
       LIMIT 50`,
      [like, like]
    )
    return result.rows
  }
}
