import { dbPool } from '../lib/db-pool'

export type StorybookItem = {
  id?: number
  child_id?: string | null
  title?: string | null
  pages?: any
  source?: string | null
  status?: string | null
}

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const storybookService = {
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
      `SELECT * FROM storybooks ${where} ORDER BY created_at DESC`,
      params
    )
    return result.rows
  },

  async getPublic(childId?: string) {
    const db = requirePool()
    const params: any[] = []
    let childWhere = ''
    if (childId) {
      params.push(childId)
      childWhere = `AND child_id = $${params.length}`
    }

    const published = await db.query(
      `SELECT * FROM storybooks
       WHERE status = 'published' ${childWhere}
       ORDER BY created_at DESC
       LIMIT 20`,
      params
    )
    return published.rows
  },

  async update(id: number, updates: Partial<StorybookItem>) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await db.query(
      `UPDATE storybooks SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  }
  ,
  async create(item: StorybookItem) {
    const db = requirePool()
    const result = await db.query(
      `INSERT INTO storybooks
        (child_id, title, pages, source, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
       RETURNING *`,
      [
        item.child_id || null,
        item.title || 'Untitled',
        item.pages || [],
        item.source || 'ai',
        item.status || 'draft'
      ]
    )
    return result.rows[0]
  },

  async bulkUpdateStatus(ids: number[], status: string) {
    if (!ids.length) return { updatedCount: 0 }
    const db = requirePool()
    const result = await db.query(
      `UPDATE storybooks
       SET status = $2, updated_at = NOW()
       WHERE id = ANY($1::int[])
       RETURNING id`,
      [ids, status]
    )
    return { updatedCount: result.rowCount || 0 }
  }
}
