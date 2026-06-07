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

const metadataPath = path.join(__dirname, '../assets/symbols/arasaac/raw/meta/metadata.en.json')
if (!fs.existsSync(metadataPath)) {
  console.error(`Metadata file not found: ${metadataPath}`)
  process.exit(1)
}

const pool = new Pool({ connectionString })

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) return null
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

type ArasaacMetadata = {
  id: number
  filename: string
  keywords?: string[]
  categories?: string[]
}

async function run() {
  const raw = fs.readFileSync(metadataPath, 'utf-8')
  const items: ArasaacMetadata[] = JSON.parse(raw)
  const cdnBase = normalizeBaseUrl(process.env.SYMBOL_CDN_BASE_URL)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let count = 0
    for (const item of items) {
      const symbolKey = item.filename
      const localPath = `/symbols/arasaac/raw/${symbolKey}`
      const cdnUrl = cdnBase ? `${cdnBase}/${encodeURIComponent(symbolKey)}` : null
      const tags = [
        ...(item.categories || []),
        ...((item.keywords || []).slice(0, 8).map(k => `kw:${k}`))
      ]

      await client.query(
        `INSERT INTO symbol_assets
          (provider, symbol_key, local_path, cdn_url, version, license, tags, is_active, created_at, updated_at)
         VALUES
          ($1, $2, $3, $4, 'v1', $5, $6::jsonb, true, NOW(), NOW())
         ON CONFLICT (provider, symbol_key, version)
         DO UPDATE SET
           local_path = EXCLUDED.local_path,
           cdn_url = EXCLUDED.cdn_url,
           license = EXCLUDED.license,
           tags = EXCLUDED.tags,
           is_active = true,
           updated_at = NOW()`,
        [
          'arasaac',
          symbolKey,
          localPath,
          cdnUrl,
          'ARASAAC terms',
          JSON.stringify(tags)
        ]
      )

      count += 1
      if (count % 1000 === 0) {
        console.log(`Seeded ${count}/${items.length}`)
      }
    }

    await client.query('COMMIT')
    console.log(`Seeded symbol_assets: ${count}`)
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to seed symbol_assets', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
