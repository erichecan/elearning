import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { Pool } from '@neondatabase/serverless'

dotenv.config({ path: path.join(__dirname, '../.env') })

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Please check your .env file.')
  process.exit(1)
}

const migrationsDir = path.join(__dirname, '../migrations')
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter(name => name.endsWith('.sql'))
  .sort()

const sql = migrationFiles
  .map(name => fs.readFileSync(path.join(migrationsDir, name), 'utf-8'))
  .join('\n\n')

const pool = new Pool({ connectionString })

async function run() {
  const client = await pool.connect()
  try {
    console.log(`Applying migrations: ${migrationFiles.join(', ')}`)
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Phase 1 migration applied')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Migration failed', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
