import { Pool } from '@neondatabase/serverless'

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null

export type VocabularyItem = {
  id?: number
  type: 'core' | 'context' | 'custom'
  word_en: string
  word_zh?: string | null
  phonetic?: string | null
  image_url?: string | null
  audio_url?: string | null
  category_id?: number | null
  difficulty_level?: number | null
  is_active?: boolean
}

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const vocabularyService = {
  async getAll(type?: string) {
    const db = requirePool()
    const params: any[] = []
    let where = ''
    if (type) {
      params.push(type)
      where = 'WHERE type = $1'
    }
    const result = await db.query(
      `SELECT * FROM vocabulary_items ${where} ORDER BY id ASC`,
      params
    )
    return result.rows
  },

  async create(item: VocabularyItem) {
    const db = requirePool()
    const result = await db.query(
      `INSERT INTO vocabulary_items
        (type, word_en, word_zh, phonetic, image_url, audio_url, category_id, difficulty_level, is_active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,true),NOW(),NOW())
       RETURNING *`,
      [
        item.type,
        item.word_en,
        item.word_zh || null,
        item.phonetic || null,
        item.image_url || null,
        item.audio_url || null,
        item.category_id || null,
        item.difficulty_level || 1,
        item.is_active !== undefined ? item.is_active : true
      ]
    )
    return result.rows[0]
  },

  async update(id: number, updates: Partial<VocabularyItem>) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await db.query(
      `UPDATE vocabulary_items SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async remove(id: number) {
    const db = requirePool()
    const result = await db.query(
      `UPDATE vocabulary_items SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    )
    return result.rows[0]
  }
}
