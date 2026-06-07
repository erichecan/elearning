import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

export type VsdScene = {
  id?: number
  child_id: string
  title: string
  context: string
  image_url: string
}

export type VsdHotspot = {
  id?: number
  scene_id: number
  label: string
  x: number
  y: number
  width: number
  height: number
  utterance: string
  vocab_id?: number | null
}

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const vsdService = {
  async getScenes(childId?: string, context?: string) {
    const db = requirePool()
    const params: any[] = []
    const filters: string[] = []
    if (childId) {
      params.push(childId)
      filters.push(`child_id = $${params.length}`)
    }
    if (context) {
      params.push(context)
      filters.push(`context = $${params.length}`)
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const result = await queryWithRetry(
      db,
      `SELECT * FROM vsd_scenes ${where} ORDER BY created_at DESC`,
      params
    )
    return result.rows
  },

  async createScene(scene: VsdScene) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `INSERT INTO vsd_scenes (child_id, title, context, image_url, created_at, updated_at)
       VALUES ($1,$2,$3,$4,NOW(),NOW())
       RETURNING *`,
      [scene.child_id, scene.title, scene.context, scene.image_url]
    )
    return result.rows[0]
  },

  async updateScene(id: number, updates: Partial<VsdScene>) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await queryWithRetry(
      db,
      `UPDATE vsd_scenes SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async deleteScene(id: number) {
    const db = requirePool()
    await queryWithRetry(db, `DELETE FROM vsd_scenes WHERE id = $1`, [id])
    return { success: true }
  },

  async getHotspots(sceneId: number) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `SELECT * FROM vsd_hotspots WHERE scene_id = $1 ORDER BY id ASC`,
      [sceneId]
    )
    return result.rows
  },

  async createHotspot(hotspot: VsdHotspot) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `INSERT INTO vsd_hotspots (scene_id, label, x, y, width, height, utterance, vocab_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
       RETURNING *`,
      [
        hotspot.scene_id,
        hotspot.label,
        hotspot.x,
        hotspot.y,
        hotspot.width,
        hotspot.height,
        hotspot.utterance,
        hotspot.vocab_id || null
      ]
    )
    return result.rows[0]
  },

  async updateHotspot(id: number, updates: Partial<VsdHotspot>) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await queryWithRetry(
      db,
      `UPDATE vsd_hotspots SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async deleteHotspot(id: number) {
    const db = requirePool()
    await queryWithRetry(db, `DELETE FROM vsd_hotspots WHERE id = $1`, [id])
    return { success: true }
  }
}
