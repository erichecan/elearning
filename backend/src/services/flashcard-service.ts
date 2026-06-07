import { dbPool } from '../lib/db-pool'

export type FlashcardItem = {
  id?: number
  child_id?: string | null
  word_en: string
  word_zh?: string | null
  image_url?: string | null
  audio_url?: string | null
  source?: string | null
  status?: string | null
}

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const flashcardService = {
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
      `SELECT * FROM flashcards ${where} ORDER BY created_at DESC`,
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
      `SELECT * FROM flashcards
       WHERE status = 'published' ${childFilter}
       ORDER BY created_at DESC
       LIMIT 200`,
      params
    )
    return published.rows
  },

  async update(id: number, updates: Partial<FlashcardItem>) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await db.query(
      `UPDATE flashcards SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  }
  ,
  async createMany(items: FlashcardItem[]) {
    const db = requirePool()
    const created: FlashcardItem[] = []
    for (const item of items) {
      const result = await db.query(
        `INSERT INTO flashcards
          (child_id, word_en, word_zh, image_url, audio_url, source, status, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
         RETURNING *`,
        [
          item.child_id || null,
          item.word_en,
          item.word_zh || null,
          item.image_url || null,
          item.audio_url || null,
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
      `UPDATE flashcards
       SET status = $2, updated_at = NOW()
       WHERE id = ANY($1::int[])
       RETURNING id`,
      [ids, status]
    )
    return { updatedCount: result.rowCount || 0 }
  }
}
