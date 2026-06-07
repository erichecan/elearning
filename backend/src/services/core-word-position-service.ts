import { dbPool } from '../lib/db-pool'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const coreWordPositionService = {
  async getPositions(childId: string, grid: string) {
    const db = requirePool()
    const result = await db.query(
      `SELECT * FROM core_word_positions WHERE child_id = $1 AND grid = $2 ORDER BY position_index ASC`,
      [childId, grid]
    )
    return result.rows
  },

  async seedPositions(childId: string, grid: string) {
    const db = requirePool()
    const words = await db.query(
      `SELECT id FROM vocabulary_items WHERE type = 'core' AND is_active = true ORDER BY id ASC`
    )

    await db.query(
      `DELETE FROM core_word_positions WHERE child_id = $1 AND grid = $2`,
      [childId, grid]
    )

    let index = 0
    for (const row of words.rows) {
      index += 1
      await db.query(
        `INSERT INTO core_word_positions (child_id, vocab_id, grid, position_index, is_locked, created_at, updated_at)
         VALUES ($1,$2,$3,$4,true,NOW(),NOW())`,
        [childId, row.id, grid, index]
      )
    }

    return { inserted: words.rows.length }
  },

  async upsertPositions(childId: string, grid: string, positions: Array<{ vocab_id: number; position_index: number; is_locked?: boolean }>) {
    const db = requirePool()
    for (const position of positions) {
      await db.query(
        `INSERT INTO core_word_positions (child_id, vocab_id, grid, position_index, is_locked, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
         ON CONFLICT (child_id, grid, position_index)
         DO UPDATE SET vocab_id = EXCLUDED.vocab_id, is_locked = EXCLUDED.is_locked, updated_at = NOW()`,
        [childId, position.vocab_id, grid, position.position_index, position.is_locked ?? true]
      )
    }
    return { updated: positions.length }
  }
}
