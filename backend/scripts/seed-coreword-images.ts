import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { Pool } from '@neondatabase/serverless'
import { imageGeneratorService } from '../src/services/image-generator'

dotenv.config({ path: path.join(__dirname, '../.env') })

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Please check your .env file.')
  process.exit(1)
}

const keywordsPath = path.join(__dirname, 'coreword-image-keywords.json')

if (!fs.existsSync(keywordsPath)) {
  console.error(`Missing keyword file: ${keywordsPath}`)
  console.error('Run: npm run prepare:coreword-images and review the queries first.')
  process.exit(1)
}

const payload = JSON.parse(fs.readFileSync(keywordsPath, 'utf-8'))
const items: Array<{ id: number; word_en: string; query: string }> = payload.items || []

async function run() {
  const pool = new Pool({ connectionString })
  try {
    for (const item of items) {
      if (!item.query || typeof item.query !== 'string') {
        console.log(`Skip ${item.word_en} (no query)`)
        continue
      }
      const existing = await pool.query('SELECT image_url FROM vocabulary_items WHERE id = $1', [item.id])
      if (existing.rows.length && existing.rows[0].image_url) {
        console.log(`Skip ${item.word_en} (already has image)`)
        continue
      }
      try {
        const imageUrl = await imageGeneratorService.searchImage(item.query)
        if (!imageUrl) {
          console.log(`No image for ${item.word_en}`)
          continue
        }
        await pool.query('UPDATE vocabulary_items SET image_url = $1, updated_at = NOW() WHERE id = $2', [imageUrl, item.id])
        console.log(`Updated ${item.word_en} -> ${imageUrl}`)
      } catch (error) {
        console.error(`Failed ${item.word_en}`, error)
      }
    }
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Seed failed', error)
  process.exit(1)
})
