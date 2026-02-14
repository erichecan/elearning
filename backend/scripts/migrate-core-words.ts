import { Pool } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function run() {
  const coreCategories = ['core', 'core_words']

  // Pull from existing words table
  const result = await pool.query(
    `SELECT w.word, w.chinese, w.image_url
     FROM words w
     LEFT JOIN categories c ON w.category_id = c.id
     WHERE w.is_active = true AND (c.name = ANY($1))
     ORDER BY w.id ASC`,
    [coreCategories]
  )

  const rows = result.rows
  if (!rows.length) {
    console.log('No core words found in words table')
    return
  }

  let inserted = 0
  for (const row of rows) {
    const exists = await pool.query(
      `SELECT id FROM vocabulary_items WHERE type = 'core' AND word_en = $1 LIMIT 1`,
      [row.word]
    )
    if (exists.rows.length) continue

    await pool.query(
      `INSERT INTO vocabulary_items
        (type, word_en, word_zh, image_url, is_active, created_at, updated_at)
       VALUES ('core', $1, $2, $3, true, NOW(), NOW())`,
      [row.word, row.chinese || null, row.image_url || null]
    )
    inserted++
  }

  console.log(`Inserted ${inserted} core words into vocabulary_items`)
}

run()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
