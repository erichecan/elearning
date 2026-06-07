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

const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, 'coreword-manual-mapping.selected.json')

if (!fs.existsSync(inputPath)) {
  console.error(`Mapping file not found: ${inputPath}`)
  process.exit(1)
}

type MappingRow = {
  id: number
  word_en?: string
  symbol_key: string
}

const rows: MappingRow[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
if (!Array.isArray(rows) || rows.length === 0) {
  console.error('Mapping file is empty or invalid')
  process.exit(1)
}

for (const row of rows) {
  if (!row.id || !row.symbol_key) {
    console.error('Invalid row:', row)
    process.exit(1)
  }
}

const pool = new Pool({ connectionString })

async function run() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let updated = 0
    for (const row of rows) {
      await client.query(
        `UPDATE vocabulary_items
         SET symbol_provider = 'arasaac',
             symbol_key = $1,
             updated_at = NOW()
         WHERE id = $2 AND type = 'core'`,
        [row.symbol_key, row.id]
      )
      updated += 1
    }

    await client.query('COMMIT')
    console.log(`Applied mappings: ${updated}`)
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to apply manual mapping', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
