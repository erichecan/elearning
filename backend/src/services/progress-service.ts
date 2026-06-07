import { dbPool } from '../lib/db-pool'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

function computeMastery(correct: number) {
  if (correct >= 8) return 5
  if (correct >= 5) return 4
  if (correct >= 3) return 3
  if (correct >= 2) return 2
  return 1
}

export const progressService = {
  async updateProgress(userId: string, wordId: number, isCorrect: boolean) {
    const db = requirePool()
    const existing = await db.query(
      `SELECT id, correct_count, wrong_count FROM learning_progress WHERE user_id = $1 AND word_id = $2`,
      [userId, wordId]
    )

    if (!existing.rows.length) {
      const correct = isCorrect ? 1 : 0
      const wrong = isCorrect ? 0 : 1
      const mastery = computeMastery(correct)
      const result = await db.query(
        `INSERT INTO learning_progress (user_id, word_id, correct_count, wrong_count, last_learned_at, mastery_level)
         VALUES ($1,$2,$3,$4,NOW(),$5)
         RETURNING *`,
        [userId, wordId, correct, wrong, mastery]
      )
      return result.rows[0]
    }

    const current = existing.rows[0]
    const correct = current.correct_count + (isCorrect ? 1 : 0)
    const wrong = current.wrong_count + (isCorrect ? 0 : 1)
    const mastery = computeMastery(correct)

    const result = await db.query(
      `UPDATE learning_progress
       SET correct_count = $1, wrong_count = $2, mastery_level = $3, last_learned_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [correct, wrong, mastery, current.id]
    )

    return result.rows[0]
  },

  async getStats(userId: string) {
    const db = requirePool()
    const [total, learned, mastered, favorites] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS count FROM words WHERE is_active = true`),
      db.query(`SELECT COUNT(*)::int AS count FROM learning_progress WHERE user_id = $1 AND (correct_count > 0 OR wrong_count > 0)`, [userId]),
      db.query(`SELECT COUNT(*)::int AS count FROM learning_progress WHERE user_id = $1 AND mastery_level >= 4`, [userId]),
      db.query(`SELECT COUNT(*)::int AS count FROM favorites WHERE user_id = $1`, [userId])
    ])

    return {
      totalWords: total.rows[0]?.count || 0,
      learnedWords: learned.rows[0]?.count || 0,
      masteredWords: mastered.rows[0]?.count || 0,
      favoriteWords: favorites.rows[0]?.count || 0
    }
  }
}
