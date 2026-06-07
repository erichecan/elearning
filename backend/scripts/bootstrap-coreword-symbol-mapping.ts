import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { Pool } from '@neondatabase/serverless'

dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const lookupPath = path.join(__dirname, '../assets/symbols/arasaac/index/keyword_lookup.en.json')
if (!fs.existsSync(lookupPath)) {
  console.error(`Lookup file not found: ${lookupPath}`)
  process.exit(1)
}

type Candidate = { id: number; filename: string; categories: string[] }
type Lookup = Record<string, Candidate[]>

const lookup: Lookup = JSON.parse(fs.readFileSync(lookupPath, 'utf-8'))
const pool = new Pool({ connectionString })

function scoreCandidate(c: Candidate) {
  const tags = (c.categories || []).map(v => v.toLowerCase())
  let score = 0
  if (tags.some(t => t.includes('core vocabulary'))) score += 5
  if (tags.includes('verb')) score += 1
  if (tags.includes('usual verbs')) score += 1
  return score
}

function selectCandidate(word: string): Candidate | null {
  const key = word.trim().toLowerCase()
  if (!key) return null
  const candidates = lookup[key] || []
  if (!candidates.length) return null
  candidates.sort((a, b) => scoreCandidate(b) - scoreCandidate(a))
  return candidates[0]
}

async function run() {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT id, word_en
       FROM vocabulary_items
       WHERE type = 'core' AND is_active = true AND (symbol_key IS NULL OR symbol_key = '')
       ORDER BY id ASC`
    )

    let mapped = 0
    let skipped = 0

    await client.query('BEGIN')
    for (const row of result.rows) {
      const picked = selectCandidate(row.word_en)
      if (!picked) {
        skipped += 1
        continue
      }

      await client.query(
        `UPDATE vocabulary_items
         SET symbol_provider = 'arasaac',
             symbol_key = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [picked.filename, row.id]
      )
      mapped += 1
    }
    await client.query('COMMIT')

    console.log(`Core words total pending: ${result.rows.length}`)
    console.log(`Mapped: ${mapped}`)
    console.log(`Skipped: ${skipped}`)
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to bootstrap mapping', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
