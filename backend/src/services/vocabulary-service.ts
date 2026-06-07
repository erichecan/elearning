import { dbPool } from '../lib/db-pool'
import { symbolAssetService } from './symbol-asset-service'
import { queryWithRetry } from '../lib/db-retry'

const pool = dbPool

export type VocabularyItem = {
  id?: number
  type: 'core' | 'context' | 'custom'
  word_en: string
  word_zh?: string | null
  phonetic?: string | null
  image_url?: string | null
  audio_url?: string | null
  symbol_provider?: string | null
  symbol_key?: string | null
  grammar_role?: string | null
  semantic_domain?: string | null
  usage_pack?: string | null
  is_core_fixed?: boolean
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
      where = 'WHERE v.type = $1'
    }
    const result = await queryWithRetry(
      db,
      `SELECT
        v.*,
        s.cdn_url AS symbol_cdn_url,
        s.local_path AS symbol_local_path
       FROM vocabulary_items v
       LEFT JOIN symbol_assets s
         ON s.provider = COALESCE(v.symbol_provider, 'arasaac')
        AND s.symbol_key = v.symbol_key
        AND s.is_active = true
       ${where}
       ORDER BY v.id ASC`,
      params
    )
    return result.rows.map((row: any) => ({
      ...row,
      resolved_image_url: symbolAssetService.resolveImageUrl(row),
      image_url: symbolAssetService.resolveImageUrl(row)
    }))
  },

  async create(item: VocabularyItem) {
    const db = requirePool()
    const result = await db.query(
      `INSERT INTO vocabulary_items
        (type, word_en, word_zh, phonetic, image_url, audio_url, symbol_provider, symbol_key, grammar_role, semantic_domain, usage_pack, is_core_fixed, category_id, difficulty_level, is_active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,COALESCE($12,false),$13,$14,COALESCE($15,true),NOW(),NOW())
       RETURNING *`,
      [
        item.type,
        item.word_en,
        item.word_zh || null,
        item.phonetic || null,
        item.image_url || null,
        item.audio_url || null,
        item.symbol_provider || null,
        item.symbol_key || null,
        item.grammar_role || null,
        item.semantic_domain || null,
        item.usage_pack || null,
        item.is_core_fixed ?? false,
        item.category_id || null,
        item.difficulty_level || 1,
        item.is_active !== undefined ? item.is_active : true
      ]
    )
    const row = result.rows[0]
    const resolved = symbolAssetService.resolveImageUrl(row)
    return { ...row, resolved_image_url: resolved, image_url: resolved || row.image_url }
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
    const row = result.rows[0]
    const resolved = symbolAssetService.resolveImageUrl(row)
    return { ...row, resolved_image_url: resolved, image_url: resolved || row.image_url }
  },

  async remove(id: number) {
    const db = requirePool()
    const result = await db.query(
      `UPDATE vocabulary_items SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    )
    const row = result.rows[0]
    const resolved = symbolAssetService.resolveImageUrl(row)
    return { ...row, resolved_image_url: resolved, image_url: resolved || row.image_url }
  }
}
