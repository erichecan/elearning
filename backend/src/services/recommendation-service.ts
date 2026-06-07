import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

type Scene = 'home' | 'school'
type TimeBucket = 'morning' | 'daytime' | 'evening' | 'night'

type CoreWordItem = {
  id: number
  en: string
  zh: string
  image: string
}

type RecommendationInput = {
  childId?: string
  taskTitle?: string
  recentWords?: string[]
  emotionZone?: 'blue' | 'green' | 'yellow' | 'red'
}

type WordRole = 'pronoun' | 'verb' | 'object' | 'descriptor' | 'question' | 'social' | 'preposition' | 'other'

const PRONOUNS = new Set(['i', 'me', 'my', 'mine', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'we', 'us', 'our', 'they', 'them'])
const VERBS = new Set(['want', 'need', 'like', 'love', 'go', 'come', 'get', 'give', 'take', 'put', 'make', 'do', 'have', 'be', 'see', 'look', 'hear', 'listen', 'feel', 'think', 'know', 'say', 'tell', 'ask', 'help', 'stop', 'start', 'finish', 'wait', 'play', 'work', 'eat', 'drink', 'sleep', 'wake', 'wash', 'clean', 'open', 'close', 'turn'])
const DESCRIPTORS = new Set(['good', 'bad', 'more', 'different', 'same', 'big', 'small', 'fast', 'slow', 'hot', 'cold', 'loud', 'quiet'])
const QUESTIONS = new Set(['what', 'where', 'why', 'who', 'when', 'how', 'which'])
const SOCIAL = new Set(['please', 'thank you', 'sorry', 'all done', 'yes', 'no'])
const PREPOSITIONS = new Set(['in', 'on', 'up', 'down', 'here', 'there', 'under', 'over', 'with', 'into', 'out', 'off', 'away'])

const SCENE_BIAS: Record<Scene, string[]> = {
  home: ['eat', 'drink', 'help', 'more', 'all done', 'please', 'want', 'go'],
  school: ['go', 'help', 'please', 'stop', 'all done', 'want', 'need', 'look']
}

const TASK_BIAS: Record<string, string[]> = {
  '刷牙': ['want', 'help', 'stop', 'all done', 'more'],
  '吃饭': ['want', 'eat', 'drink', 'more', 'please'],
  '上学': ['go', 'want', 'help', 'please', 'all done']
}

const TIME_BIAS: Record<Scene, Record<TimeBucket, string[]>> = {
  home: {
    morning: ['wake', 'wash', 'eat', 'drink', 'go'],
    daytime: ['play', 'eat', 'drink', 'help', 'more'],
    evening: ['eat', 'drink', 'help', 'all done', 'sleep'],
    night: ['sleep', 'all done', 'quiet', 'stop', 'help']
  },
  school: {
    morning: ['go', 'help', 'look', 'listen', 'please'],
    daytime: ['help', 'look', 'listen', 'play', 'stop'],
    evening: ['go', 'all done', 'help', 'please', 'stop'],
    night: ['all done', 'quiet', 'stop', 'help', 'please']
  }
}

const EMOTION_BIAS: Record<'blue' | 'green' | 'yellow' | 'red', string[]> = {
  blue: ['help', 'drink', 'more', 'all done', 'please'],
  green: ['want', 'go', 'play', 'eat', 'drink'],
  yellow: ['help', 'stop', 'wait', 'please', 'more'],
  red: ['stop', 'help', 'all done', 'quiet', 'please']
}

function getTimeBucket(now = new Date()): TimeBucket {
  const hour = now.getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'daytime'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function normalizeWord(word: string) {
  return word.trim().toLowerCase()
}

function classifyRole(word: string): WordRole {
  const key = normalizeWord(word)
  if (PRONOUNS.has(key)) return 'pronoun'
  if (VERBS.has(key)) return 'verb'
  if (DESCRIPTORS.has(key)) return 'descriptor'
  if (QUESTIONS.has(key)) return 'question'
  if (SOCIAL.has(key)) return 'social'
  if (PREPOSITIONS.has(key)) return 'preposition'
  return 'object'
}

function buildExpectedRoleWeights(recentWords: string[]) {
  const last = recentWords.length ? recentWords[recentWords.length - 1] : ''
  const lastRole = last ? classifyRole(last) : 'other'

  if (!recentWords.length) {
    return new Map<WordRole, number>([
      ['pronoun', 2.4],
      ['verb', 1.4],
      ['social', 0.8],
      ['object', 0.7],
      ['descriptor', 0.3],
      ['question', 0.2],
      ['preposition', 0.2],
      ['other', 0.1]
    ])
  }

  if (lastRole === 'pronoun') {
    return new Map<WordRole, number>([
      ['verb', 2.8],
      ['social', 0.8],
      ['object', 0.5],
      ['descriptor', 0.3],
      ['preposition', 0.3],
      ['question', 0.2],
      ['pronoun', -0.8],
      ['other', 0.1]
    ])
  }

  if (lastRole === 'verb') {
    return new Map<WordRole, number>([
      ['object', 2.5],
      ['descriptor', 1.4],
      ['preposition', 0.9],
      ['social', 0.8],
      ['question', 0.2],
      ['pronoun', 0.1],
      ['verb', -0.7],
      ['other', 0.2]
    ])
  }

  if (lastRole === 'object') {
    return new Map<WordRole, number>([
      ['social', 1.4],
      ['descriptor', 1.2],
      ['verb', 1.0],
      ['preposition', 0.8],
      ['question', 0.4],
      ['pronoun', 0.2],
      ['object', -0.4],
      ['other', 0.2]
    ])
  }

  return new Map<WordRole, number>([
    ['verb', 1.3],
    ['object', 1.0],
    ['social', 0.9],
    ['descriptor', 0.6],
    ['preposition', 0.5],
    ['question', 0.3],
    ['pronoun', 0.3],
    ['other', 0.2]
  ])
}

async function loadHistoryRates(scene: Scene, childId?: string) {
  if (!dbPool) return new Map<number, { shown: number; accept: number }>()

  const shownContext = `shown|scene=${scene}%`
  const acceptContext = `accept|scene=${scene}%`
  const child = childId || null

  const [shownRes, acceptRes] = await Promise.all([
    queryWithRetry(
      dbPool,
      `SELECT vocab_id::bigint AS vocab_id, COUNT(*)::int AS shown_count
       FROM (
         SELECT UNNEST(recommended_vocab_ids) AS vocab_id
         FROM recommendation_events
         WHERE context LIKE $1
           AND recommended_vocab_ids IS NOT NULL
           AND created_at >= NOW() - INTERVAL '30 days'
           AND ($2::uuid IS NULL OR child_id = $2)
       ) s
       GROUP BY vocab_id`,
      [shownContext, child]
    ),
    queryWithRetry(
      dbPool,
      `SELECT accepted_vocab_id::bigint AS vocab_id, COUNT(*)::int AS accept_count
       FROM recommendation_events
       WHERE context LIKE $1
         AND accepted_vocab_id IS NOT NULL
         AND created_at >= NOW() - INTERVAL '30 days'
         AND ($2::uuid IS NULL OR child_id = $2)
       GROUP BY accepted_vocab_id`,
      [acceptContext, child]
    )
  ])

  const stats = new Map<number, { shown: number; accept: number }>()
  for (const row of shownRes.rows as any[]) {
    const id = Number(row.vocab_id)
    stats.set(id, { shown: Number(row.shown_count || 0), accept: 0 })
  }
  for (const row of acceptRes.rows as any[]) {
    const id = Number(row.vocab_id)
    const prev = stats.get(id) || { shown: 0, accept: 0 }
    prev.accept = Number(row.accept_count || 0)
    stats.set(id, prev)
  }
  return stats
}

function buildSuggestedSentence(recentWords: string[], rankedWords: CoreWordItem[]) {
  const cleanedRecent = recentWords.map((w) => w.trim()).filter(Boolean)
  const used = new Set(cleanedRecent.map((w) => normalizeWord(w)))
  const picks: string[] = []

  if (cleanedRecent.length === 0) {
    picks.push('I')
  } else {
    picks.push(...cleanedRecent.slice(-2))
  }

  for (const item of rankedWords) {
    const key = normalizeWord(item.en)
    if (used.has(key)) continue
    picks.push(item.en)
    used.add(key)
    if (picks.length >= 4) break
  }

  if (!picks.some((w) => normalizeWord(w) === 'please')) {
    picks.push('please')
  }

  return picks.slice(0, 5).join(' ')
}

export const recommendationService = {
  async rank(scene: Scene, coreWords: CoreWordItem[], input: RecommendationInput = {}) {
    const recentWords = (input.recentWords || []).slice(-6)
    const recentSet = new Set(recentWords.map(normalizeWord))
    const taskTitle = input.taskTitle || ''
    const emotionZone = input.emotionZone || 'green'
    const expectedRoleWeights = buildExpectedRoleWeights(recentWords)
    const sceneBias = new Set((SCENE_BIAS[scene] || []).map(normalizeWord))
    const taskBias = new Set((TASK_BIAS[taskTitle] || []).map(normalizeWord))
    const timeBucket = getTimeBucket()
    const timeBias = new Set((TIME_BIAS[scene]?.[timeBucket] || []).map(normalizeWord))
    const emotionBias = new Set((EMOTION_BIAS[emotionZone] || []).map(normalizeWord))
    const historyStats = await loadHistoryRates(scene, input.childId)

    const scored = coreWords.map((item) => {
      const key = normalizeWord(item.en)
      const role = classifyRole(item.en)
      const roleScore = expectedRoleWeights.get(role) || 0
      const sceneScore = sceneBias.has(key) ? 0.7 : 0
      const taskScore = taskBias.has(key) ? 0.9 : 0
      const timeScore = timeBias.has(key) ? 0.6 : 0
      const emotionScore = emotionBias.has(key) ? 0.8 : 0
      const recencyPenalty = recentSet.has(key) ? -1.1 : 0
      const startupBias = recentWords.length === 0 && key === 'i' ? 1.2 : 0

      const stats = historyStats.get(item.id) || { shown: 0, accept: 0 }
      const acceptanceRate = stats.shown > 0 ? stats.accept / stats.shown : 0
      const historyScore = stats.shown >= 5 ? Math.min(1.6, acceptanceRate * 2.4) : Math.min(0.8, stats.accept * 0.2)

      const score = roleScore + sceneScore + taskScore + timeScore + emotionScore + recencyPenalty + startupBias + historyScore
      return { item, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const ranked = scored.slice(0, 6).map((entry) => entry.item)
    const recommendedIds = ranked.map((word) => word.id)
    const sentence = buildSuggestedSentence(recentWords, ranked)
    return { recommendedIds, sentence }
  },

  async shown(
    childId: string | null,
    scene: Scene,
    recommendedIds: number[],
    recentWords: string[] = [],
    taskTitle = ''
  ) {
    if (!dbPool) return null
    const result = await queryWithRetry(
      dbPool,
      `INSERT INTO recommendation_events (child_id, context, recommended_vocab_ids, recommended_sentence, accepted_vocab_id, created_at)
       VALUES ($1,$2,$3,$4,$5,NOW())
       RETURNING id`,
      [
        childId,
        `shown|scene=${scene}|task=${taskTitle || '-'}|last=${normalizeWord(recentWords[recentWords.length - 1] || '-')}`,
        recommendedIds,
        recentWords.join(' ').trim() || null,
        null
      ]
    )
    return result.rows[0]
  },

  async accept(
    childId: string | null,
    scene: Scene,
    recommendedIds: number[],
    acceptedId: number,
    recentWords: string[] = []
  ) {
    if (!dbPool) return null
    const result = await queryWithRetry(
      dbPool,
      `INSERT INTO recommendation_events (child_id, context, recommended_vocab_ids, recommended_sentence, accepted_vocab_id, created_at)
       VALUES ($1,$2,$3,$4,$5,NOW())
       RETURNING *`,
      [
        childId,
        `accept|scene=${scene}|last=${normalizeWord(recentWords[recentWords.length - 1] || '-')}`,
        recommendedIds,
        recentWords.join(' ').trim() || null,
        acceptedId
      ]
    )
    return result.rows[0]
  },

  async sentenceComplete(childId: string | null, scene: Scene, sentenceWords: string[], sentenceVocabIds: number[] = []) {
    if (!dbPool) return null
    const normalized = sentenceWords.map((w) => w.trim()).filter(Boolean)
    if (normalized.length < 2) return null
    const result = await queryWithRetry(
      dbPool,
      `INSERT INTO recommendation_events (child_id, context, recommended_vocab_ids, recommended_sentence, accepted_vocab_id, created_at)
       VALUES ($1,$2,$3,$4,$5,NOW())
       RETURNING id`,
      [childId, `complete|scene=${scene}|len=${normalized.length}`, sentenceVocabIds, normalized.join(' '), null]
    )
    return result.rows[0]
  }
}
