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
  },

  // A3: 学完即用 —— 把一张闪卡加入儿童的 AAC 词板（与 AAC 同源）。
  // 复用/创建 type='custom' 的 vocabulary_items，并加入该儿童 core_word_positions，
  // 回首页即可在核心词网格使用。去重 + 幂等。
  async addToBoard(flashcardId: number, childId: string) {
    const db = requirePool()

    const fcRes = await db.query(
      `SELECT id, word_en, word_zh, image_url, vocab_id FROM flashcards WHERE id = $1`,
      [flashcardId]
    )
    const card = fcRes.rows[0]
    if (!card) throw new Error('Flashcard not found')

    // 1. 复用或创建 custom 词（按 word_en 去重）
    let vocabId: number | null = card.vocab_id ? Number(card.vocab_id) : null
    if (!vocabId) {
      const existing = await db.query(
        `SELECT id FROM vocabulary_items
         WHERE type = 'custom' AND lower(word_en) = lower($1) AND is_active = true
         LIMIT 1`,
        [card.word_en]
      )
      if (existing.rows[0]) {
        vocabId = Number(existing.rows[0].id)
      } else {
        const created = await db.query(
          `INSERT INTO vocabulary_items
            (type, word_en, word_zh, image_url, is_active, created_at, updated_at)
           VALUES ('custom', $1, $2, $3, true, NOW(), NOW())
           RETURNING id`,
          [card.word_en, card.word_zh || null, card.image_url || null]
        )
        vocabId = Number(created.rows[0].id)
      }
    }

    // 2. 加入该儿童核心词网格（若尚未在板上）—— 位置固定（is_locked）
    const onBoard = await db.query(
      `SELECT id FROM core_word_positions WHERE child_id = $1 AND vocab_id = $2 LIMIT 1`,
      [childId, vocabId]
    )
    const alreadyOnBoard = onBoard.rows.length > 0
    if (!alreadyOnBoard) {
      const pos = await db.query(
        `SELECT COALESCE(MAX(position_index), -1) + 1 AS next,
                COALESCE(MAX(grid), '6x6') AS grid
         FROM core_word_positions WHERE child_id = $1`,
        [childId]
      )
      await db.query(
        `INSERT INTO core_word_positions
          (child_id, vocab_id, grid, position_index, is_locked, created_at, updated_at)
         VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
        [childId, vocabId, pos.rows[0].grid || '6x6', Number(pos.rows[0].next)]
      )
    }

    // 3. 回填 flashcards.vocab_id（需 migration 006；未迁移则忽略，不阻断主流程）
    if (!card.vocab_id) {
      try {
        await db.query(`UPDATE flashcards SET vocab_id = $1, updated_at = NOW() WHERE id = $2`, [vocabId, flashcardId])
      } catch {
        // vocab_id 列尚未迁移时跳过回填
      }
    }

    return { vocabId, alreadyOnBoard }
  }
}
