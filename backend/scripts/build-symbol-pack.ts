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

const args = process.argv.slice(2)
function getArg(name: string, fallback?: string) {
  const i = args.indexOf(name)
  if (i >= 0 && i + 1 < args.length) return args[i + 1]
  return fallback
}

const provider = 'arasaac'
const packName = getArg('--pack', 'core-200')!
const version = getArg('--version', process.env.SYMBOL_PACK_VERSION || 'v1')!
const typeFilter = getArg('--type', '')
const limitRaw = getArg('--limit', '')
const limit = limitRaw ? Number(limitRaw) : 0
const applyUsagePack = args.includes('--apply-usage-pack')

if (!packName) {
  console.error('Missing --pack')
  process.exit(1)
}
if (limitRaw && (!Number.isFinite(limit) || limit <= 0)) {
  console.error('Invalid --limit value')
  process.exit(1)
}

const rawDir = path.join(__dirname, '../assets/symbols/arasaac/raw/png')
const packDir = path.join(__dirname, `../public/symbols/arasaac/${version}/${packName}`)
const manifestDir = path.join(__dirname, '../public/symbols/arasaac/manifest')
const manifestPath = path.join(manifestDir, `${packName}.${version}.json`)
const latestPath = path.join(manifestDir, `${packName}.latest.json`)

if (!fs.existsSync(rawDir)) {
  console.error(`Raw symbol dir not found: ${rawDir}`)
  process.exit(1)
}

type Row = { id: number; word_en: string; symbol_key: string; type: string }

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

function buildInQuery(ids: number[], startIndex = 1) {
  return ids.map((_, i) => `$${startIndex + i}`).join(',')
}

async function run() {
  ensureDir(packDir)
  ensureDir(manifestDir)

  const pool = new Pool({ connectionString })
  const client = await pool.connect()
  try {
    const where: string[] = [
      `is_active = true`,
      `symbol_provider = $1`,
      `symbol_key IS NOT NULL`,
      `symbol_key <> ''`
    ]
    const params: any[] = [provider]
    if (typeFilter) {
      params.push(typeFilter)
      where.push(`type = $${params.length}`)
    }

    const limitClause = limit > 0 ? `LIMIT ${limit}` : ''

    const query = `
      SELECT id, word_en, symbol_key, type
      FROM vocabulary_items
      WHERE ${where.join(' AND ')}
      ORDER BY CASE WHEN type = 'core' THEN 0 ELSE 1 END, id ASC
      ${limitClause}
    `

    const res = await client.query<Row>(query, params)
    const rows = res.rows
    if (!rows.length) {
      console.error('No mapped vocabulary items found for pack build')
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
        vocab_type: row.type,
        word_en: row.word_en,
        symbol_key: row.symbol_key,
        url: `/symbols/arasaac/${version}/${packName}/${row.symbol_key}`
      }
    })

    if (applyUsagePack) {
      const ids = rows.map(r => Number(r.id))
      const inQuery = buildInQuery(ids, 2)
      await client.query(
        `UPDATE vocabulary_items
         SET usage_pack = $1, updated_at = NOW()
         WHERE id IN (${inQuery})`,
        [packName, ...ids]
      )
    }

    const manifest = {
      provider,
      version,
      pack: packName,
      type_filter: typeFilter || null,
      limit: limit || null,
      apply_usage_pack: applyUsagePack,
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
  console.error('Failed to build symbol pack', error)
  process.exit(1)
})
