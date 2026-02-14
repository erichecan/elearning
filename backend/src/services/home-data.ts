import { Pool } from '@neondatabase/serverless'

export type CoreWordItem = {
  id: number
  en: string
  zh: string
  image: string
}

type RecommendationInput = {
  taskTitle?: string
  recentWords?: string[]
}

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null

const coreWordsHome: CoreWordItem[] = [
  { id: 1, en: 'I want', zh: '我想要', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 2, en: 'help', zh: '帮助', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=400&fit=crop' },
  { id: 3, en: 'more', zh: '更多', image: 'https://images.unsplash.com/photo-1504674900242-4197e29c3d14?w=400&h=400&fit=crop' },
  { id: 4, en: 'stop', zh: '停止', image: 'https://images.unsplash.com/photo-1504252060324-1c3e8e47c518?w=400&h=400&fit=crop' },
  { id: 5, en: 'drink', zh: '喝水', image: 'https://images.unsplash.com/photo-1502741126161-b048400dfe5c?w=400&h=400&fit=crop' },
  { id: 6, en: 'eat', zh: '吃', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop' },
  { id: 7, en: 'toilet', zh: '厕所', image: 'https://images.unsplash.com/photo-1503480207415-fdddcc21b2b1?w=400&h=400&fit=crop' },
  { id: 8, en: 'break', zh: '休息', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 9, en: 'play', zh: '玩', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=400&fit=crop' },
  { id: 10, en: 'yes', zh: '是', image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop' },
  { id: 11, en: 'no', zh: '不是', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=400&fit=crop' },
  { id: 12, en: 'tired', zh: '累了', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 13, en: 'music', zh: '音乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop' },
  { id: 14, en: 'quiet', zh: '安静', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 15, en: 'bathroom', zh: '洗手间', image: 'https://images.unsplash.com/photo-1503480207415-fdddcc21b2b1?w=400&h=400&fit=crop' },
  { id: 16, en: 'together', zh: '一起', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop' },
  { id: 17, en: 'go', zh: '去', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 18, en: 'here', zh: '这里', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 19, en: 'there', zh: '那里', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 20, en: 'all done', zh: '完成', image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=400&h=400&fit=crop' },
  { id: 21, en: 'happy', zh: '开心', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 22, en: 'sad', zh: '难过', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 23, en: 'angry', zh: '生气', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 24, en: 'scared', zh: '害怕', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 25, en: 'look', zh: '看', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 26, en: 'like', zh: '喜欢', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 27, en: 'don’t like', zh: '不喜欢', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 28, en: 'need', zh: '需要', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 29, en: 'please', zh: '请', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 30, en: 'thank you', zh: '谢谢', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop' },
  { id: 31, en: 'go home', zh: '回家', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
  { id: 32, en: 'go school', zh: '去学校', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop' },
]

const coreWordsSchool: CoreWordItem[] = coreWordsHome

function normalizeWord(word: string) {
  return word.trim().toLowerCase()
}

function pickByEn(coreWords: CoreWordItem[], desired: string[]) {
  const set = new Set(desired.map(normalizeWord))
  return coreWords.filter(item => set.has(normalizeWord(item.en)))
}

function uniqueById(items: CoreWordItem[]) {
  const seen = new Set<number>()
  const result: CoreWordItem[] = []
  for (const item of items) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    result.push(item)
  }
  return result
}

async function queryCoreWordsFromDb(): Promise<CoreWordItem[] | null> {
  if (!pool) return null
  try {
    const result = await pool.query(
      `SELECT id, word_en, word_zh, image_url
       FROM vocabulary_items
       WHERE type = 'core' AND is_active = true
       ORDER BY id ASC
       LIMIT 64`
    )
    if (!result.rows.length) return null
    return result.rows.map((row: any) => ({
      id: Number(row.id),
      en: row.word_en,
      zh: row.word_zh || '',
      image: row.image_url || ''
    }))
  } catch (error) {
    return null
  }
}

async function queryCoreWordsFromWordsTable(): Promise<CoreWordItem[] | null> {
  if (!pool) return null
  try {
    const result = await pool.query(
      `SELECT w.id, w.word, w.chinese, w.image_url
       FROM words w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.is_active = true AND (c.name = 'core' OR c.name = 'core_words')
       ORDER BY w.id ASC
       LIMIT 64`
    )
    if (!result.rows.length) return null
    return result.rows.map((row: any) => ({
      id: Number(row.id),
      en: row.word,
      zh: row.chinese || '',
      image: row.image_url || ''
    }))
  } catch (error) {
    return null
  }
}

function ruleBasedRecommendation(scene: 'home' | 'school', coreWords: CoreWordItem[], input: RecommendationInput) {
  const sceneDefaults = scene === 'home'
    ? ['I want', 'drink', 'eat', 'break', 'go home', 'all done']
    : ['I want', 'help', 'go', 'go school', 'all done', 'please']

  const taskRules: Record<string, string[]> = {
    '刷牙': ['help', 'stop', 'all done', 'more', 'need'],
    '吃饭': ['eat', 'more', 'drink', 'please', 'all done'],
    '上学': ['go', 'go school', 'help', 'please', 'all done']
  }

  const recentRules: Record<string, string[]> = {
    'i want': ['eat', 'drink', 'play', 'go', 'help'],
    'go': ['here', 'there', 'go home', 'go school'],
    'help': ['please', 'stop', 'more']
  }

  let picks: CoreWordItem[] = []

  const taskTitle = input.taskTitle || ''
  if (taskTitle && taskRules[taskTitle]) {
    picks = picks.concat(pickByEn(coreWords, taskRules[taskTitle]))
  }

  const recentWords = (input.recentWords || []).slice(-3)
  if (recentWords.length) {
    const last = normalizeWord(recentWords[recentWords.length - 1])
    if (recentRules[last]) {
      picks = picks.concat(pickByEn(coreWords, recentRules[last]))
    }
  }

  picks = picks.concat(pickByEn(coreWords, sceneDefaults))
  picks = uniqueById(picks)

  if (picks.length < 6) {
    picks = picks.concat(coreWords.slice(0, 6 - picks.length))
    picks = uniqueById(picks)
  }

  return picks.slice(0, 6)
}

export const homeDataService = {
  async getCoreWords(scene: 'home' | 'school') {
    const fromVocab = await queryCoreWordsFromDb()
    if (fromVocab && fromVocab.length > 0) return fromVocab
    const fromWords = await queryCoreWordsFromWordsTable()
    if (fromWords && fromWords.length > 0) return fromWords
    return scene === 'school' ? coreWordsSchool : coreWordsHome
  },
  async getTaskReminder() {
    if (pool) {
      try {
        const result = await pool.query(
          `SELECT t.id, t.title, r.scheduled_at, COALESCE(r.status, 'pending') as status
           FROM schedules s
           JOIN tasks t ON t.schedule_id = s.id
           LEFT JOIN reminders r ON r.task_id = t.id AND r.status = 'pending'
           WHERE s.is_active = true
           ORDER BY r.scheduled_at ASC NULLS LAST, t.order_index ASC
           LIMIT 1`
        )
        if (result.rows.length) {
          const row = result.rows[0]
          return {
            title: row.title,
            time: row.scheduled_at ? new Date(row.scheduled_at).toISOString() : '',
            status: row.status || 'pending',
            taskId: Number(row.id)
          }
        }
      } catch (error) {
        // fall back
      }
    }
    return { title: '刷牙', time: '08:30', status: 'pending', taskId: 1 }
  },
  async getRecommendations(scene: 'home' | 'school', input: RecommendationInput = {}) {
    const coreWords = await this.getCoreWords(scene)
    const recommended = ruleBasedRecommendation(scene, coreWords, input)
    const recommendedIds = recommended.map(item => item.id)
    const recommendedSentence = recommended.slice(0, 3).map(item => item.en).join(' ')
    return {
      recommendedIds,
      sentence: recommendedSentence || (scene === 'home' ? 'I want drink, please' : 'I want go school, please')
    }
  },
  async getRewardSummary() {
    return { coins: 12, level: 1 }
  }
}
