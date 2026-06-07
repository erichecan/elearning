-- phase1 symbols schema

ALTER TABLE vocabulary_items
  ADD COLUMN IF NOT EXISTS symbol_provider text,
  ADD COLUMN IF NOT EXISTS symbol_key text,
  ADD COLUMN IF NOT EXISTS grammar_role text,
  ADD COLUMN IF NOT EXISTS semantic_domain text,
  ADD COLUMN IF NOT EXISTS usage_pack text,
  ADD COLUMN IF NOT EXISTS is_core_fixed boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_vocab_symbol_provider_key
  ON vocabulary_items(symbol_provider, symbol_key);

CREATE INDEX IF NOT EXISTS idx_vocab_grammar_role
  ON vocabulary_items(grammar_role);

CREATE INDEX IF NOT EXISTS idx_vocab_usage_pack
  ON vocabulary_items(usage_pack);

CREATE TABLE IF NOT EXISTS symbol_assets (
  id bigserial PRIMARY KEY,
  provider text NOT NULL,
  symbol_key text NOT NULL,
  local_path text,
  cdn_url text,
  version text NOT NULL DEFAULT 'v1',
  license text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, symbol_key, version)
);

CREATE INDEX IF NOT EXISTS idx_symbol_assets_provider_key
  ON symbol_assets(provider, symbol_key);

