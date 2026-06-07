import { dbPool } from '../lib/db-pool'

export type ChildProfile = {
  id?: string
  name: string
  birthdate?: string | null
  primary_language?: string | null
  notes?: string | null
}

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const childService = {
  async getAll() {
    const db = requirePool()
    const result = await db.query(
      `SELECT * FROM child_profiles ORDER BY created_at ASC`
    )
    return result.rows
  },

  async create(child: ChildProfile) {
    const db = requirePool()
    const result = await db.query(
      `INSERT INTO child_profiles (name, birthdate, primary_language, notes, created_at, updated_at)
       VALUES ($1,$2,$3,$4,NOW(),NOW())
       RETURNING *`,
      [
        child.name,
        child.birthdate || null,
        child.primary_language || 'en',
        child.notes || null
      ]
    )
    return result.rows[0]
  }
}
