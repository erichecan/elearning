import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

type FocusTask = {
  id: number
  title: string
  steps: string[]
  estMinutes: number
}

const pool = dbPool

export const focusDataService = {
  async getCurrentTask(childId?: string): Promise<FocusTask | null> {
    if (!pool) return null
    try {
      const params: any[] = []
      let whereChild = ''
      if (childId) {
        params.push(childId)
        whereChild = 'AND s.child_id = $1'
      }
      const result = await queryWithRetry(
        pool,
        `SELECT t.id, t.title, t.estimated_minutes, ARRAY_AGG(ts.title ORDER BY ts.order_index) AS steps
         FROM tasks t
         JOIN schedules s ON s.id = t.schedule_id
         LEFT JOIN task_steps ts ON ts.task_id = t.id
         WHERE s.is_active = true ${whereChild}
         GROUP BY t.id
         ORDER BY t.order_index ASC
         LIMIT 1`,
        params
      )

      if (!result.rows.length) return null

      const row = result.rows[0]
      try {
        await queryWithRetry(
          pool,
          `UPDATE reminders
           SET status = 'now', updated_at = NOW()
           WHERE task_id = $1
             AND status = 'pending'
             AND (scheduled_at IS NULL OR scheduled_at <= NOW())`,
          [row.id]
        )
      } catch (error) {
        // non-blocking
      }
      return {
        id: Number(row.id),
        title: row.title,
        steps: (row.steps || []).filter(Boolean),
        estMinutes: row.estimated_minutes || 5
      }
    } catch (error) {
      return null
    }
  }
}
