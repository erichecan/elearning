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

const pool = new Pool({ connectionString })

function parseCoreWords(markdown: string) {
  const lines = markdown.split('\n')
  const rows: { en: string; zh: string }[] = []

  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue
    if (line.includes('---')) continue
    const parts = line.split('|').map(p => p.trim()).filter(Boolean)
    if (parts.length < 3) continue
    const index = Number(parts[0])
    if (!Number.isFinite(index)) continue
    const en = parts[1]
    const zh = parts[2]
    if (!en) continue
    rows.push({ en, zh })
  }

  return rows
}

async function upsertCategory(name: string, displayName: string) {
  const result = await pool.query(
    `INSERT INTO categories (name, display_name, created_at, updated_at)
     VALUES ($1,$2,NOW(),NOW())
     ON CONFLICT (name) DO UPDATE SET display_name = EXCLUDED.display_name
     RETURNING id`,
    [name, displayName]
  )
  return Number(result.rows[0].id)
}

async function ensureUserAndChild() {
  const userRes = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    ['caregiver@example.com']
  )
  let userId: string
  if (userRes.rows.length) {
    userId = userRes.rows[0].id
  } else {
    const created = await pool.query(
      `INSERT INTO users (role, display_name, email, created_at, updated_at)
       VALUES ('caregiver', 'Caregiver', $1, NOW(), NOW())
       RETURNING id`,
      ['caregiver@example.com']
    )
    userId = created.rows[0].id
  }

  const childRes = await pool.query(
    `SELECT id FROM child_profiles ORDER BY created_at ASC LIMIT 1`
  )
  let childId: string
  if (childRes.rows.length) {
    childId = childRes.rows[0].id
  } else {
    const child = await pool.query(
      `INSERT INTO child_profiles (name, primary_language, created_at, updated_at)
       VALUES ('Ava', 'en', NOW(), NOW())
       RETURNING id`
    )
    childId = child.rows[0].id
  }

  await pool.query(
    `INSERT INTO caregiver_child (caregiver_id, child_id, role, created_at)
     VALUES ($1,$2,'owner',NOW())
     ON CONFLICT DO NOTHING`,
    [userId, childId]
  )

  return { userId, childId }
}

async function seedSchedule(childId: string) {
  const scheduleRes = await pool.query(
    `SELECT id FROM schedules WHERE child_id = $1 ORDER BY created_at ASC LIMIT 1`,
    [childId]
  )
  if (scheduleRes.rows.length) return

  const schedule = await pool.query(
    `INSERT INTO schedules (child_id, title, description, is_active, created_at, updated_at)
     VALUES ($1, '早晨流程', '日常早晨任务', true, NOW(), NOW())
     RETURNING id`,
    [childId]
  )
  const scheduleId = schedule.rows[0].id

  const task = await pool.query(
    `INSERT INTO tasks (schedule_id, title, order_index, estimated_minutes, created_at, updated_at)
     VALUES ($1, '刷牙', 1, 5, NOW(), NOW())
     RETURNING id`,
    [scheduleId]
  )
  const taskId = task.rows[0].id

  const steps = ['拿牙刷', '挤牙膏', '刷上下牙', '漱口', '擦嘴']
  for (let i = 0; i < steps.length; i += 1) {
    await pool.query(
      `INSERT INTO task_steps (task_id, title, order_index, created_at, updated_at)
       VALUES ($1,$2,$3,NOW(),NOW())`,
      [taskId, steps[i], i + 1]
    )
  }

  const now = new Date()
  await pool.query(
    `INSERT INTO reminders (task_id, scheduled_at, status, created_at, updated_at)
     VALUES ($1, $2, 'pending', NOW(), NOW())`,
    [taskId, now.toISOString()]
  )
}

function getPublicBaseUrl() {
  return (process.env.BACKEND_PUBLIC_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')
}

async function seedDefaultVsd(childId: string) {
  const base = getPublicBaseUrl()
  const defaults = [
    {
      context: 'home',
      title: '客厅场景',
      image_url: `${base}/vsd/home-default.svg`,
      hotspot: { label: '喝水', x: 0.66, y: 0.58, width: 0.18, height: 0.2, utterance: 'I want drink water' }
    },
    {
      context: 'school',
      title: '教室场景',
      image_url: `${base}/vsd/school-default.svg`,
      hotspot: { label: '请帮我', x: 0.24, y: 0.56, width: 0.2, height: 0.22, utterance: 'I need help please' }
    }
  ]

  for (const item of defaults) {
    let sceneId: number
    const existingScene = await pool.query(
      `SELECT id FROM vsd_scenes WHERE child_id = $1 AND context = $2 ORDER BY created_at ASC LIMIT 1`,
      [childId, item.context]
    )
    if (existingScene.rows.length) {
      sceneId = Number(existingScene.rows[0].id)
      await pool.query(
        `UPDATE vsd_scenes
         SET title = COALESCE(NULLIF(title, ''), $2),
             image_url = COALESCE(NULLIF(image_url, ''), $3),
             updated_at = NOW()
         WHERE id = $1`,
        [sceneId, item.title, item.image_url]
      )
    } else {
      const created = await pool.query(
        `INSERT INTO vsd_scenes (child_id, title, context, image_url, created_at, updated_at)
         VALUES ($1,$2,$3,$4,NOW(),NOW())
         RETURNING id`,
        [childId, item.title, item.context, item.image_url]
      )
      sceneId = Number(created.rows[0].id)
    }

    const existingHotspot = await pool.query(
      `SELECT id FROM vsd_hotspots WHERE scene_id = $1 ORDER BY created_at ASC LIMIT 1`,
      [sceneId]
    )
    if (!existingHotspot.rows.length) {
      await pool.query(
        `INSERT INTO vsd_hotspots (scene_id, label, x, y, width, height, utterance, vocab_id, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NULL,NOW(),NOW())`,
        [
          sceneId,
          item.hotspot.label,
          item.hotspot.x,
          item.hotspot.y,
          item.hotspot.width,
          item.hotspot.height,
          item.hotspot.utterance
        ]
      )
    }
  }
}

async function seedCoreWords(categoryId: number) {
  const markdownPath = path.join(__dirname, '../../docs/CORE_WORDS_200_LIST.md')
  const markdown = fs.readFileSync(markdownPath, 'utf-8')
  const words = parseCoreWords(markdown)

  for (const word of words) {
    await pool.query(
      `INSERT INTO vocabulary_items (type, word_en, word_zh, category_id, difficulty_level, is_active, created_at, updated_at)
       SELECT 'core', $1, $2, $3, 1, true, NOW(), NOW()
       WHERE NOT EXISTS (
         SELECT 1 FROM vocabulary_items WHERE type = 'core' AND lower(word_en) = lower($1)
       )`,
      [word.en, word.zh, categoryId]
    )
  }
}

async function run() {
  try {
    const { childId } = await ensureUserAndChild()
    const categoryId = await upsertCategory('core', 'Core Words')
    await seedCoreWords(categoryId)
    await seedSchedule(childId)
    await seedDefaultVsd(childId)

    console.log('Seed completed')
  } catch (error) {
    console.error('Seed failed', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

run()
