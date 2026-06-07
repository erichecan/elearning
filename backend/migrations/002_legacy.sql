-- Legacy tables for words/favorites/learning_progress (compat layer)

CREATE TABLE IF NOT EXISTS words (
  id bigserial PRIMARY KEY,
  word text NOT NULL,
  chinese text,
  phonetic text,
  image_url text,
  audio_url text,
  category_id bigint REFERENCES categories(id),
  difficulty_level int NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  is_approved boolean NOT NULL DEFAULT false,
  sentence text,
  sentence_cn text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  word_id bigint REFERENCES words(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word_id)
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  word_id bigint REFERENCES words(id) ON DELETE CASCADE,
  correct_count int NOT NULL DEFAULT 0,
  wrong_count int NOT NULL DEFAULT 0,
  last_learned_at timestamptz NOT NULL DEFAULT now(),
  mastery_level int NOT NULL DEFAULT 1,
  UNIQUE (user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_words_category ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON learning_progress(user_id);
