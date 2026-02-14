# DATA_MODEL

**范围**
Phase 1 数据模型（Neon Postgres）。以 MVP 为目标，同时为后续功能预留扩展字段。

**核心原则**
1. 以 `child_profile` 为中心
1. 数据分为三类：配置数据（词库/场景/日程）、内容数据（flashcards/math/story）、行为数据（AAC点击/任务完成/推荐事件）
1. 鉴权降级：暂不做复杂 RBAC，但表结构保留扩展字段

---

**1) 用户与关系（MVP 简化）**
1. `users`
1. `id` (uuid, PK)
1. `role` (text: caregiver | therapist | admin)
1. `display_name` (text)
1. `email` (text, nullable)
1. `created_at`, `updated_at`
1. `child_profiles`
1. `id` (uuid, PK)
1. `name` (text)
1. `birthdate` (date, nullable)
1. `primary_language` (text, default 'en')
1. `notes` (text, nullable)
1. `created_at`, `updated_at`
1. `caregiver_child`
1. `caregiver_id` (uuid, FK users)
1. `child_id` (uuid, FK child_profiles)
1. `role` (text: owner | editor | viewer)
1. `created_at`

---

**2) 词库与 Core Words**
1. `categories`
1. `id` (bigint, PK)
1. `name` (text, unique)
1. `display_name` (text)
1. `icon` (text, nullable)
1. `color` (text, nullable)
1. `created_at`, `updated_at`
1. `vocabulary_items`
1. `id` (bigint, PK)
1. `type` (text: core | context | custom)
1. `word_en` (text)
1. `word_zh` (text, nullable)
1. `phonetic` (text, nullable)
1. `image_url` (text, nullable)
1. `audio_url` (text, nullable)
1. `category_id` (FK categories, nullable)
1. `difficulty_level` (int, default 1)
1. `is_active` (bool, default true)
1. `created_at`, `updated_at`
1. `core_word_positions`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `vocab_id` (bigint, FK vocabulary_items)
1. `grid` (text: 4x4 | 5x5 | 6x6 | ...)
1. `position_index` (int)  
1. `is_locked` (bool, default true)
1. `created_at`, `updated_at`

---

**3) VSD 场景**
1. `vsd_scenes`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `title` (text)
1. `context` (text: home | school | custom)
1. `image_url` (text)
1. `created_at`, `updated_at`
1. `vsd_hotspots`
1. `id` (bigint, PK)
1. `scene_id` (bigint, FK vsd_scenes)
1. `label` (text)
1. `x`, `y`, `width`, `height` (float)
1. `utterance` (text)  
1. `vocab_id` (bigint, FK vocabulary_items, nullable)
1. `created_at`, `updated_at`

---

**4) 日程与任务**
1. `schedules`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `title` (text)
1. `description` (text, nullable)
1. `is_active` (bool, default true)
1. `created_at`, `updated_at`
1. `tasks`
1. `id` (bigint, PK)
1. `schedule_id` (bigint, FK schedules)
1. `title` (text)
1. `order_index` (int)
1. `estimated_minutes` (int, nullable)
1. `created_at`, `updated_at`
1. `task_steps`
1. `id` (bigint, PK)
1. `task_id` (bigint, FK tasks)
1. `title` (text)
1. `media_url` (text, nullable)
1. `order_index` (int)
1. `created_at`, `updated_at`
1. `reminders`
1. `id` (bigint, PK)
1. `task_id` (bigint, FK tasks)
1. `scheduled_at` (timestamp)
1. `status` (text: pending | sent | done)
1. `created_at`, `updated_at`

---

**5) 奖励系统**
1. `token_ledgers`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `source` (text: task_complete | aac_use | manual)
1. `amount` (int)
1. `metadata` (jsonb, nullable)
1. `created_at`
1. `reward_rules`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `title` (text)
1. `cost` (int)
1. `reward_payload` (jsonb)  
1. `is_active` (bool, default true)
1. `created_at`, `updated_at`
1. `redemptions`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `reward_id` (bigint, FK reward_rules)
1. `status` (text: requested | granted | rejected)
1. `created_at`, `updated_at`

---

**6) 学习内容（Flashcards / Math / Story）**
1. `flashcards`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles, nullable)
1. `word_en` (text)
1. `word_zh` (text, nullable)
1. `image_url` (text, nullable)
1. `audio_url` (text, nullable)
1. `source` (text: ai | manual | import)
1. `status` (text: draft | approved | rejected | published)
1. `created_at`, `updated_at`
1. `math_exercises`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles, nullable)
1. `difficulty` (int)
1. `question_text` (text)
1. `question_payload` (jsonb)  
1. `answer_payload` (jsonb)
1. `source` (text: ai | manual)
1. `status` (text: draft | approved | published)
1. `created_at`, `updated_at`
1. `storybooks`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles, nullable)
1. `title` (text)
1. `pages` (jsonb)  
1. `source` (text: ai | manual)
1. `status` (text: draft | approved | published)
1. `created_at`, `updated_at`

---

**7) 行为与分析**
1. `analytics_events`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `event_type` (text: aac_click | task_done | reward_gain | recommendation_shown)
1. `event_payload` (jsonb)
1. `created_at`
1. `abc_logs`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `antecedent` (jsonb)
1. `behavior` (jsonb)
1. `consequence` (jsonb)
1. `created_at`
1. `behavior_notes` (text, nullable)

---

**8) AI 推荐日志（Core Words）**
1. `recommendation_events`
1. `id` (bigint, PK)
1. `child_id` (uuid, FK child_profiles)
1. `context` (text: home | school | task | other)
1. `recommended_vocab_ids` (bigint[])
1. `recommended_sentence` (text, nullable)
1. `accepted_vocab_id` (bigint, nullable)
1. `created_at`

---

**说明**
1. 鉴权降级：暂不建复杂权限模型，仅保留 `users` 与 `caregiver_child` 关系。
1. 录音行为数据：当前不建 `audio_recordings` 表，后续可补充。

