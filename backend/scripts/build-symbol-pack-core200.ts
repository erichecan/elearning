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

const provider = 'arasaac'
const version = process.env.SYMBOL_PACK_VERSION || 'v1'
const packName = 'core-200'

const rawDir = path.join(__dirname, '../assets/symbols/arasaac/raw/png')
const packDir = path.join(__dirname, `../public/symbols/arasaac/${version}/${packName}`)
const manifestDir = path.join(__dirname, '../public/symbols/arasaac/manifest')
const manifestPath = path.join(manifestDir, `${packName}.${version}.json`)
const latestPath = path.join(manifestDir, `${packName}.latest.json`)

if (!fs.existsSync(rawDir)) {
  console.error(`Raw symbol dir not found: ${rawDir}`)
  process.exit(1)
}

type Row = { id: number; word_en: string; symbol_key: string }

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copyOrLink(src: string, dst: string) {
  if (fs.existsSync(dst)) return
  try {
    fs.linkSync(src, dst)
  } catch {
    fs.copyFileSync(src, dst)
  }
}

async function run() {
  ensureDir(packDir)
  ensureDir(manifestDir)

  const pool = new Pool({ connectionString })
  const client = await pool.connect()
  try {
    const res = await client.query<Row>(
      `SELECT id, word_en, symbol_key
       FROM vocabulary_items
       WHERE type = 'core' AND is_active = true AND symbol_provider = $1 AND symbol_key IS NOT NULL AND symbol_key <> ''
       ORDER BY id ASC`,
      [provider]
    )

    const rows = res.rows
    if (!rows.length) {
      console.error('No mapped core words found for pack build')
      process.exit(1)
    }

    let copied = 0
    const missing: string[] = []
    const items = rows.map((row) => {
      const src = path.join(rawDir, row.symbol_key)
      const dst = path.join(packDir, row.symbol_key)
      if (fs.existsSync(src)) {
        copyOrLink(src, dst)
        copied += 1
      } else {
        missing.push(row.symbol_key)
      }
      return {
        vocab_id: Number(row.id),
        word_en: row.word_en,
        symbol_key: row.symbol_key,
        url: `/symbols/arasaac/${version}/${packName}/${row.symbol_key}`
      }
    })

    await client.query(
      `UPDATE vocabulary_items
       SET usage_pack = $1, updated_at = NOW()
       WHERE type = 'core' AND is_active = true AND symbol_provider = $2 AND symbol_key IS NOT NULL AND symbol_key <> ''`,
      [packName, provider]
    )

    const manifest = {
      provider,
      version,
      pack: packName,
      generated_at: new Date().toISOString(),
      total_items: items.length,
      copied_files: copied,
      missing_files: missing,
      items
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
    fs.writeFileSync(latestPath, JSON.stringify(manifest, null, 2), 'utf-8')

    console.log(`Built pack: ${packName} (${version})`)
    console.log(`Manifest: ${manifestPath}`)
    console.log(`Items: ${items.length}, copied: ${copied}, missing: ${missing.length}`)
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Failed to build core-200 pack', error)
  process.exit(1)
})
