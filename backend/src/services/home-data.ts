import { dbPool } from '../lib/db-pool'
import { symbolAssetService } from './symbol-asset-service'
import { queryWithRetry } from '../lib/db-retry'
import { recommendationService } from './recommendation-service'

export type CoreWordItem = {
  id: number
  en: string
  zh: string
  image: string
}

type RecommendationInput = {
  taskTitle?: string
  recentWords?: string[]
  childId?: string
  emotionZone?: 'blue' | 'green' | 'yellow' | 'red'
}

const pool = dbPool

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

async function queryCoreWordsFromDb(childId?: string): Promise<CoreWordItem[] | null> {
  if (!pool) return null
  try {
    if (childId) {
      const positioned = await queryWithRetry(
        pool,
        `SELECT
          v.id,
          v.word_en,
          v.word_zh,
          v.image_url,
          v.symbol_provider,
          v.symbol_key,
          v.usage_pack,
          s.cdn_url AS symbol_cdn_url,
          s.local_path AS symbol_local_path
         FROM core_word_positions p
         JOIN vocabulary_items v ON v.id = p.vocab_id
         LEFT JOIN symbol_assets s
           ON s.provider = COALESCE(v.symbol_provider, 'arasaac')
          AND s.symbol_key = v.symbol_key
          AND s.is_active = true
         WHERE p.child_id = $1 AND v.type = 'core' AND v.is_active = true
         ORDER BY p.position_index ASC
         LIMIT 64`,
        [childId]
      )
      if (positioned.rows.length) {
        return positioned.rows.map((row: any) => ({
          id: Number(row.id),
          en: row.word_en,
          zh: row.word_zh || '',
          image: symbolAssetService.resolveImageUrl(row) || ''
        }))
      }
    }

    const result = await queryWithRetry(
      pool,
      `SELECT
        v.id,
        v.word_en,
        v.word_zh,
        v.image_url,
        v.symbol_provider,
        v.symbol_key,
        v.usage_pack,
        s.cdn_url AS symbol_cdn_url,
        s.local_path AS symbol_local_path
       FROM vocabulary_items v
       LEFT JOIN symbol_assets s
         ON s.provider = COALESCE(v.symbol_provider, 'arasaac')
        AND s.symbol_key = v.symbol_key
        AND s.is_active = true
       WHERE v.type = 'core' AND v.is_active = true
       ORDER BY v.id ASC
       LIMIT 64`
    )
    if (!result.rows.length) return null
    return result.rows.map((row: any) => {
      return {
        id: Number(row.id),
        en: row.word_en,
        zh: row.word_zh || '',
        image: symbolAssetService.resolveImageUrl(row) || ''
      }
    })
  } catch (error) {
    return null
  }
}

async function queryCoreWordsFromWordsTable(): Promise<CoreWordItem[] | null> {
  if (!pool) return null
  try {
    const result = await queryWithRetry(
      pool,
      `SELECT w.id, w.word, w.chinese, w.image_url
       FROM words w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.is_active = true AND (c.name = 'core' OR c.name = 'core_words')
       ORDER BY w.id ASC
       LIMIT 64`
    )
    if (!result.rows.length) return null
    return result.rows.map((row: any) => {
      return {
        id: Number(row.id),
        en: row.word,
        zh: row.chinese || '',
        image: row.image_url || ''
      }
    })
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
  async getCoreWords(scene: 'home' | 'school', childId?: string) {
    const fromVocab = await queryCoreWordsFromDb(childId)
    if (fromVocab && fromVocab.length > 0) return fromVocab
    const fromWords = await queryCoreWordsFromWordsTable()
    if (fromWords && fromWords.length > 0) return fromWords
    return coreWordsFallback
  },
  async getTaskReminder(childId?: string) {
    if (pool) {
      try {
        const params: any[] = []
        let whereChild = ''
        if (childId) {
          params.push(childId)
          whereChild = 'AND s.child_id = $1'
        }
        const result = await queryWithRetry(
          pool,
          `SELECT t.id, t.title, r.scheduled_at, COALESCE(r.status, 'pending') as status
           FROM schedules s
           JOIN tasks t ON t.schedule_id = s.id
           LEFT JOIN reminders r ON r.task_id = t.id AND r.status IN ('now', 'pending')
           WHERE s.is_active = true ${whereChild}
           ORDER BY CASE r.status WHEN 'now' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END,
                    r.scheduled_at ASC NULLS LAST,
                    t.order_index ASC
           LIMIT 1`,
          params
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
    return null
  },
  async getRecommendations(scene: 'home' | 'school', input: RecommendationInput = {}) {
    const coreWords = await this.getCoreWords(scene, input.childId)
    try {
      return await recommendationService.rank(scene, coreWords, input)
    } catch {
      const recommended = ruleBasedRecommendation(scene, coreWords, input)
      const recommendedIds = recommended.map(item => item.id)
      const recommendedSentence = recommended.slice(0, 3).map(item => item.en).join(' ')
      return {
        recommendedIds,
        sentence: recommendedSentence || (scene === 'home' ? 'I want drink, please' : 'I want go school, please')
      }
    }
  },
  async getRewardSummary(childId?: string) {
    if (pool) {
      try {
        const params: any[] = []
        let whereChild = ''
        if (childId) {
          params.push(childId)
          whereChild = 'WHERE child_id = $1'
        }
        const result = await queryWithRetry(
          pool,
          `SELECT COALESCE(SUM(amount), 0) AS coins
           FROM token_ledgers ${whereChild}`,
          params
        )
        const coins = Number(result.rows?.[0]?.coins || 0)
        return { coins, level: coins >= 20 ? 2 : 1 }
      } catch (error) {
        // fall back
      }
    }
    return { coins: 0, level: 1 }
  }
}
const coreWordsFallback: CoreWordItem[] = [
  { id: 1, en: 'like', zh: '喜欢', image: '' },
  { id: 2, en: 'want', zh: '想要', image: '' },
  { id: 3, en: 'get', zh: '得到', image: '' },
  { id: 4, en: 'make', zh: '做', image: '' },
  { id: 5, en: 'go', zh: '去', image: '' },
  { id: 6, en: 'look', zh: '看', image: '' },
  { id: 7, en: 'turn', zh: '转', image: '' },
  { id: 8, en: 'help', zh: '帮助', image: '' },
  { id: 9, en: 'open', zh: '打开', image: '' },
  { id: 10, en: 'do', zh: '做', image: '' },
  { id: 11, en: 'put', zh: '放', image: '' },
  { id: 12, en: 'can', zh: '可以', image: '' },
  { id: 13, en: 'finished', zh: '完成', image: '' },
  { id: 14, en: 'stop', zh: '停止', image: '' },
  { id: 15, en: 'good', zh: '好', image: '' },
  { id: 16, en: 'more', zh: '更多', image: '' },
  { id: 17, en: 'not', zh: '不', image: '' },
  { id: 18, en: 'different', zh: '不同', image: '' },
  { id: 19, en: 'same', zh: '相同', image: '' },
  { id: 20, en: 'I', zh: '我', image: '' },
  { id: 21, en: 'he', zh: '他', image: '' },
  { id: 22, en: 'you', zh: '你', image: '' },
  { id: 23, en: 'she', zh: '她', image: '' },
  { id: 24, en: 'it', zh: '它', image: '' },
  { id: 25, en: 'that', zh: '那个', image: '' },
  { id: 26, en: 'in', zh: '在…里', image: '' },
  { id: 27, en: 'on', zh: '在…上', image: '' },
  { id: 28, en: 'up', zh: '向上', image: '' },
  { id: 29, en: 'here', zh: '这里', image: '' },
  { id: 30, en: 'some', zh: '一些', image: '' },
  { id: 31, en: 'all', zh: '全部', image: '' },
  { id: 32, en: 'what', zh: '什么', image: '' },
  { id: 33, en: 'where', zh: '哪里', image: '' },
  { id: 34, en: 'why', zh: '为什么', image: '' },
  { id: 35, en: 'who', zh: '谁', image: '' },
  { id: 36, en: 'when', zh: '什么时候', image: '' }
]
