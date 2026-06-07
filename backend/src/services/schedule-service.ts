import { dbPool } from '../lib/db-pool'

type CompletionResult = {
  ok: boolean
  rewardIssued: boolean
}

const pool = dbPool

export const scheduleService = {
  async completeTask(taskId: number): Promise<CompletionResult> {
    if (!pool) return { ok: true, rewardIssued: false }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const taskResult = await client.query(
        `SELECT t.id, s.child_id
         FROM tasks t
         JOIN schedules s ON s.id = t.schedule_id
         WHERE t.id = $1`,
        [taskId]
      )

      await client.query(
        `UPDATE reminders
         SET status = 'done', updated_at = NOW()
         WHERE task_id = $1 AND status <> 'done'`,
        [taskId]
      )

      let rewardIssued = false
      if (taskResult.rows.length && taskResult.rows[0].child_id) {
        await client.query(
          `INSERT INTO token_ledgers (child_id, source, amount, metadata, created_at)
           VALUES ($1, 'task_complete', 1, jsonb_build_object('taskId', $2::bigint), NOW())`,
          [taskResult.rows[0].child_id, taskId]
        )
        rewardIssued = true
      }

      await client.query('COMMIT')
      return { ok: true, rewardIssued }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
