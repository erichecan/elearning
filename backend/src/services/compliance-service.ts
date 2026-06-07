import { dbPool } from '../lib/db-pool'
import { queryWithRetry } from '../lib/db-retry'

const pool = dbPool

function requirePool() {
  if (!pool) throw new Error('DATABASE_URL not configured')
  return pool
}

export const complianceService = {
  getChecklist() {
    return {
      coppa: {
        parental_consent_flow: true,
        child_data_minimization: true,
        third_party_sharing_blocked: true
      },
      gdpr: {
        export_endpoint_ready: true,
        delete_endpoint_ready: true,
        retention_policy_documented: true
      },
      security: {
        media_encryption_at_rest: false,
        pii_log_redaction: true,
        role_access_controls: true
      }
    }
  },

  async listParentalConsents(childId: string) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `SELECT *
       FROM parental_consents
       WHERE child_id = $1
       ORDER BY granted_at DESC, created_at DESC`,
      [childId]
    )
    return result.rows
  },

  async createParentalConsent(input: {
    childId: string
    guardianName: string
    relationship?: string | null
    consentVersion?: string | null
    consentMethod?: string | null
    scope?: any
  }) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `INSERT INTO parental_consents
       (child_id, guardian_name, relationship, consent_version, consent_method, scope, granted_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
       RETURNING *`,
      [
        input.childId,
        input.guardianName,
        input.relationship || null,
        input.consentVersion || 'v1',
        input.consentMethod || 'checkbox',
        input.scope || {}
      ]
    )
    return result.rows[0]
  },

  async revokeParentalConsent(id: number, revokeReason?: string | null) {
    const db = requirePool()
    const result = await queryWithRetry(
      db,
      `UPDATE parental_consents
       SET revoked_at = NOW(),
           revoke_reason = $2,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, revokeReason || null]
    )
    return result.rows[0] || null
  },

  async exportChildData(childId: string, requestedBy = 'admin') {
    const db = requirePool()
    const [
      child,
      schedules,
      rewards,
      storybooks,
      flashcards,
      mathExercises,
      analytics,
      recommendations
    ] = await Promise.all([
      queryWithRetry(db, `SELECT * FROM child_profiles WHERE id = $1`, [childId]),
      queryWithRetry(db, `SELECT * FROM schedules WHERE child_id = $1`, [childId]),
      queryWithRetry(db, `SELECT * FROM reward_rules WHERE child_id = $1`, [childId]),
      queryWithRetry(db, `SELECT * FROM storybooks WHERE child_id = $1`, [childId]),
      queryWithRetry(db, `SELECT * FROM flashcards WHERE child_id = $1`, [childId]),
      queryWithRetry(db, `SELECT * FROM math_exercises WHERE child_id = $1`, [childId]),
      queryWithRetry(db, `SELECT * FROM analytics_events WHERE child_id = $1 ORDER BY created_at DESC LIMIT 5000`, [childId]),
      queryWithRetry(db, `SELECT * FROM recommendation_events WHERE child_id = $1 ORDER BY created_at DESC LIMIT 5000`, [childId])
    ])

    const payload = {
      child_profile: child.rows[0] || null,
      schedules: schedules.rows,
      rewards: rewards.rows,
      storybooks: storybooks.rows,
      flashcards: flashcards.rows,
      math_exercises: mathExercises.rows,
      analytics_events: analytics.rows,
      recommendation_events: recommendations.rows
    }

    await queryWithRetry(
      db,
      `INSERT INTO compliance_requests (request_type, child_id, requested_by, status, response_payload, created_at)
       VALUES ('export', $1, $2, 'done', $3, NOW())`,
      [childId, requestedBy, payload]
    )

    return payload
  },

  async deleteChildData(childId: string, requestedBy = 'admin') {
    const db = requirePool()
    const client = await db.connect()
    try {
      await client.query('BEGIN')

      await client.query(`DELETE FROM recommendation_events WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM analytics_events WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM math_exercises WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM flashcards WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM storybooks WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM reward_rules WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM token_ledgers WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM redemptions WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM core_word_positions WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM caregiver_child WHERE child_id = $1`, [childId])
      await client.query(`DELETE FROM child_profiles WHERE id = $1`, [childId])

      await client.query(
        `INSERT INTO compliance_requests (request_type, child_id, requested_by, status, response_payload, created_at)
         VALUES ('delete', $1, $2, 'done', $3, NOW())`,
        [childId, requestedBy, { deleted: true }]
      )

      await client.query('COMMIT')
      return { deleted: true }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
