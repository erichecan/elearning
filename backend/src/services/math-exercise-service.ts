import { dbPool } from '../lib/db-pool'

export type MathExerciseItem = {
  id?: number
  child_id?: string | null
  difficulty?: number | null
  question_text?: string | null
  question_payload?: any
  answer_payload?: any
  source?: string | null
  status?: string | null
}

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const mathExerciseService = {
  async getAll(status?: string, childId?: string) {
    const db = requirePool()
    const params: any[] = []
    const filters: string[] = []

    if (status) {
      params.push(status)
      filters.push(`status = $${params.length}`)
    }

    if (childId) {
      params.push(childId)
      filters.push(`child_id = $${params.length}`)
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const result = await db.query(
      `SELECT * FROM math_exercises ${where} ORDER BY created_at DESC`,
      params
    )
    return result.rows
  },

  async getPublic(childId?: string) {
    const db = requirePool()
    const params: any[] = []
    const childFilter = childId ? `AND child_id = $1` : ''
    if (childId) params.push(childId)

    const published = await db.query(
      `SELECT * FROM math_exercises
       WHERE status = 'published' ${childFilter}
       ORDER BY created_at DESC
       LIMIT 200`,
      params
    )
    return published.rows
  },

  async update(id: number, updates: Partial<MathExerciseItem>) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await db.query(
      `UPDATE math_exercises SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  }
  ,
  async createMany(items: MathExerciseItem[]) {
    const db = requirePool()
    const created: MathExerciseItem[] = []
    for (const item of items) {
      const result = await db.query(
        `INSERT INTO math_exercises
          (child_id, difficulty, question_text, question_payload, answer_payload, source, status, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
         RETURNING *`,
        [
          item.child_id || null,
          item.difficulty || 1,
          item.question_text || '',
          item.question_payload || {},
          item.answer_payload || {},
          item.source || 'ai',
          item.status || 'draft'
        ]
      )
      created.push(result.rows[0])
    }
    return created
  },

  async bulkUpdateStatus(ids: number[], status: string) {
    if (!ids.length) return { updatedCount: 0 }
    const db = requirePool()
    const result = await db.query(
      `UPDATE math_exercises
       SET status = $2, updated_at = NOW()
       WHERE id = ANY($1::int[])
       RETURNING id`,
      [ids, status]
    )
    return { updatedCount: result.rowCount || 0 }
  }
}
