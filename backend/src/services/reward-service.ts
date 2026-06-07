import { dbPool } from '../lib/db-pool'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const rewardService = {
  async getRules(childId?: string) {
    const db = requirePool()
    const params: any[] = []
    let where = ''
    if (childId) {
      params.push(childId)
      where = 'WHERE child_id = $1'
    }
    const result = await db.query(
      `SELECT * FROM reward_rules ${where} ORDER BY created_at DESC`,
      params
    )
    return result.rows
  },

  async createRule(rule: { child_id: string; title: string; cost: number; reward_payload?: any }) {
    const db = requirePool()
    const result = await db.query(
      `INSERT INTO reward_rules (child_id, title, cost, reward_payload, is_active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,true,NOW(),NOW())
       RETURNING *`,
      [rule.child_id, rule.title, rule.cost, rule.reward_payload || {}]
    )
    return result.rows[0]
  },

  async updateRule(id: number, updates: { title?: string; cost?: number; reward_payload?: any; is_active?: boolean }) {
    const db = requirePool()
    const fields = Object.keys(updates)
    if (fields.length === 0) throw new Error('No updates')

    const setClauses = fields.map((field, idx) => `${field} = $${idx + 1}`)
    const values = fields.map((f) => (updates as any)[f])
    values.push(id)

    const result = await db.query(
      `UPDATE reward_rules SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      values
    )
    return result.rows[0]
  },

  async redeem(childId: string, rewardId: number) {
    const db = requirePool()
    const client = await db.connect()
    try {
      await client.query('BEGIN')

      const ruleResult = await client.query(
        `SELECT id, child_id, title, cost, is_active
         FROM reward_rules
         WHERE id = $1`,
        [rewardId]
      )
      const rule = ruleResult.rows[0]
      if (!rule) throw new Error('Reward not found')
      if (!rule.is_active) throw new Error('Reward is inactive')
      if (rule.child_id && rule.child_id !== childId) throw new Error('Reward does not belong to this child')

      const balanceResult = await client.query(
        `SELECT COALESCE(SUM(amount), 0) AS coins
         FROM token_ledgers
         WHERE child_id = $1`,
        [childId]
      )
      const currentCoins = Number(balanceResult.rows?.[0]?.coins || 0)
      const cost = Number(rule.cost || 0)
      if (currentCoins < cost) throw new Error('Insufficient coins')

      const redemptionResult = await client.query(
        `INSERT INTO redemptions (child_id, reward_id, status, created_at, updated_at)
         VALUES ($1, $2, 'granted', NOW(), NOW())
         RETURNING *`,
        [childId, rewardId]
      )
      const redemption = redemptionResult.rows[0]

      await client.query(
        `INSERT INTO token_ledgers (child_id, source, amount, metadata, created_at)
         VALUES ($1, 'reward_redeem', $2, $3, NOW())`,
        [
          childId,
          -cost,
          {
            rewardId: Number(rule.id),
            title: String(rule.title || ''),
            cost,
            redemptionId: Number(redemption.id)
          }
        ]
      )

      const afterCoins = currentCoins - cost
      await client.query('COMMIT')
      return { ...redemption, coins_after: afterCoins }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  async getRedemptionHistory(childId: string, limit = 30) {
    const db = requirePool()
    const result = await db.query(
      `SELECT
         r.id,
         r.child_id,
         r.reward_id,
         r.status,
         r.created_at,
         rr.title,
         rr.cost
       FROM redemptions r
       LEFT JOIN reward_rules rr ON rr.id = r.reward_id
       WHERE r.child_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2`,
      [childId, limit]
    )
    return result.rows
  }
}
