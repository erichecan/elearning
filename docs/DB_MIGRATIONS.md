# DB_MIGRATIONS

**说明**
以下为 Phase 1 推荐的迁移 SQL 草案（可用于 Neon）。实际执行前需确认表名与现有数据兼容。

```sql
-- 1) users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  display_name text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) child_profiles
CREATE TABLE IF NOT EXISTS child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birthdate date,
  primary_language text DEFAULT 'en',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) caregiver_child
CREATE TABLE IF NOT EXISTS caregiver_child (
  caregiver_id uuid REFERENCES users(id),
  child_id uuid REFERENCES child_profiles(id),
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (caregiver_id, child_id)
);

-- 4) categories
CREATE TABLE IF NOT EXISTS categories (
  id bigserial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  icon text,
  color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5) vocabulary_items
CREATE TABLE IF NOT EXISTS vocabulary_items (
  id bigserial PRIMARY KEY,
  type text NOT NULL,
  word_en text NOT NULL,
  word_zh text,
  phonetic text,
  image_url text,
  audio_url text,
  category_id bigint REFERENCES categories(id),
  difficulty_level int NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6) core_word_positions
CREATE TABLE IF NOT EXISTS core_word_positions (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  vocab_id bigint REFERENCES vocabulary_items(id),
  grid text NOT NULL,
  position_index int NOT NULL,
  is_locked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_id, grid, position_index)
);

-- 7) VSD scenes
CREATE TABLE IF NOT EXISTS vsd_scenes (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  title text NOT NULL,
  context text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vsd_hotspots (
  id bigserial PRIMARY KEY,
  scene_id bigint REFERENCES vsd_scenes(id) ON DELETE CASCADE,
  label text NOT NULL,
  x float NOT NULL,
  y float NOT NULL,
  width float NOT NULL,
  height float NOT NULL,
  utterance text NOT NULL,
  vocab_id bigint REFERENCES vocabulary_items(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 8) schedules
CREATE TABLE IF NOT EXISTS schedules (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id bigserial PRIMARY KEY,
  schedule_id bigint REFERENCES schedules(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_index int NOT NULL,
  estimated_minutes int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_steps (
  id bigserial PRIMARY KEY,
  task_id bigint REFERENCES tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  media_url text,
  order_index int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reminders (
  id bigserial PRIMARY KEY,
  task_id bigint REFERENCES tasks(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9) tokens & rewards
CREATE TABLE IF NOT EXISTS token_ledgers (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  source text NOT NULL,
  amount int NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reward_rules (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  title text NOT NULL,
  cost int NOT NULL,
  reward_payload jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS redemptions (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  reward_id bigint REFERENCES reward_rules(id),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 10) learning content
CREATE TABLE IF NOT EXISTS flashcards (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  word_en text NOT NULL,
  word_zh text,
  image_url text,
  audio_url text,
  source text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS math_exercises (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  difficulty int NOT NULL,
  question_text text NOT NULL,
  question_payload jsonb NOT NULL,
  answer_payload jsonb NOT NULL,
  source text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS storybooks (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  title text NOT NULL,
  pages jsonb NOT NULL,
  source text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 11) analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  event_type text NOT NULL,
  event_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS abc_logs (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  antecedent jsonb,
  behavior jsonb,
  consequence jsonb,
  behavior_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 12) recommendation events
CREATE TABLE IF NOT EXISTS recommendation_events (
  id bigserial PRIMARY KEY,
  child_id uuid REFERENCES child_profiles(id),
  context text NOT NULL,
  recommended_vocab_ids bigint[],
  recommended_sentence text,
  accepted_vocab_id bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index suggestions
CREATE INDEX IF NOT EXISTS idx_vocab_type ON vocabulary_items(type);
CREATE INDEX IF NOT EXISTS idx_vocab_category ON vocabulary_items(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_schedule ON tasks(schedule_id);
CREATE INDEX IF NOT EXISTS idx_steps_task ON task_steps(task_id);
CREATE INDEX IF NOT EXISTS idx_events_child_time ON analytics_events(child_id, created_at);
```

