export const syncPolicyService = {
  getPolicy() {
    return {
      mode: 'offline-first',
      primary_writer: 'parent',
      conflict_rules: [
        {
          scope: 'core_word_positions',
          rule: 'parent_wins_latest_timestamp'
        },
        {
          scope: 'vsd_hotspots',
          rule: 'parent_wins_latest_timestamp'
        },
        {
          scope: 'reward_rules',
          rule: 'parent_wins_latest_timestamp'
        }
      ],
      retry: {
        max_attempts: 5,
        backoff_ms: [200, 500, 1000, 2000, 5000]
      }
    }
  }
}

