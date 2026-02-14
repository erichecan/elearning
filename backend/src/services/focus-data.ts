import { Pool } from '@neondatabase/serverless'

type FocusTask = {
  id: number
  title: string
  steps: string[]
  estMinutes: number
}

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null

const fallbackTask: FocusTask = {
  id: 1,
  title: '刷牙',
  steps: ['拿牙刷', '挤牙膏', '刷上下牙', '漱口', '擦嘴'],
  estMinutes: 5
}

export const focusDataService = {
  async getCurrentTask(): Promise<FocusTask> {
    if (!pool) return fallbackTask
    try {
      const result = await pool.query(
        `SELECT t.id, t.title, t.estimated_minutes, ARRAY_AGG(ts.title ORDER BY ts.order_index) AS steps
         FROM tasks t
         JOIN schedules s ON s.id = t.schedule_id
         LEFT JOIN task_steps ts ON ts.task_id = t.id
         WHERE s.is_active = true
         GROUP BY t.id
         ORDER BY t.order_index ASC
         LIMIT 1`
      )

      if (!result.rows.length) return fallbackTask

      const row = result.rows[0]
      return {
        id: Number(row.id),
        title: row.title,
        steps: (row.steps || []).filter(Boolean),
        estMinutes: row.estimated_minutes || 5
      }
    } catch (error) {
      return fallbackTask
    }
  }
}
