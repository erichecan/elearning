import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

export type AnalyticsEvent = {
  child_id?: string | null
  event_type: string
  event_payload?: any
}

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const analyticsService = {
  async logEvent(event: AnalyticsEvent) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `INSERT INTO analytics_events (child_id, event_type, event_payload, created_at)
       VALUES ($1,$2,$3,NOW())
       RETURNING *`,
      [event.child_id || null, event.event_type, event.event_payload || {}]
    )
    return result.rows[0]
  }
  ,
  async getSummary(params: any[], where: string) {
    const db = requirePool()
    const rows = await queryWithRetry(
      db,
      `SELECT event_type, COUNT(*)::int AS count
       FROM analytics_events
       ${where}
       GROUP BY event_type
       ORDER BY count DESC`,
      params
    )
    const total = rows.rows.reduce((sum: number, row: any) => sum + Number(row.count || 0), 0)
    return { total, byType: rows.rows }
  },

  async getTherapistSummary(childId?: string) {
    const db = requirePool()
    const child = childId || null

    const [eventCounts, recCounts] = await Promise.all([
      queryWithRetry(
        db,
        `SELECT event_type, COUNT(*)::int AS count
         FROM analytics_events
         WHERE ($1::uuid IS NULL OR child_id = $1)
         GROUP BY event_type`,
        [child]
      ),
      queryWithRetry(
        db,
        `SELECT
           COUNT(*) FILTER (WHERE context LIKE 'shown|%')::int AS shown_count,
           COUNT(*) FILTER (WHERE context LIKE 'accept|%')::int AS accept_count,
           COUNT(*) FILTER (WHERE context LIKE 'complete|%')::int AS complete_count
         FROM recommendation_events
         WHERE ($1::uuid IS NULL OR child_id = $1)`,
        [child]
      )
    ])

    const countMap = new Map<string, number>()
    for (const row of eventCounts.rows as any[]) {
      countMap.set(String(row.event_type), Number(row.count || 0))
    }

    const rec = (recCounts.rows?.[0] || {}) as any
    const shown = Number(rec.shown_count || 0)
    const accept = Number(rec.accept_count || 0)
    const complete = Number(rec.complete_count || 0)
    const aacClicks = Number(countMap.get('aac_click') || 0)
    const taskDone = Number(countMap.get('task_done') || 0)
    const emotionChecks = Number(countMap.get('emotion_zone_selected') || 0)
    const mathSuccess =
      Number(countMap.get('math_make10_success') || 0) +
      Number(countMap.get('math_carry_success') || 0)

    const recommendationAcceptanceRate = shown > 0 ? accept / shown : 0
    const independentCommunicationRate = aacClicks > 0 ? complete / aacClicks : 0

    return {
      aacClicks,
      recommendationShown: shown,
      recommendationAccepted: accept,
      recommendationAcceptanceRate,
      sentenceCompleted: complete,
      independentCommunicationRate,
      taskDone,
      emotionChecks,
      mathSuccess
    }
  }
}
