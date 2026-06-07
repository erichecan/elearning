-- Phase 6: compliance helpers + storybook favorites

CREATE TABLE IF NOT EXISTS storybook_favorites (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  storybook_id bigint NOT NULL REFERENCES storybooks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, storybook_id)
);

CREATE INDEX IF NOT EXISTS idx_storybook_favorites_user
  ON storybook_favorites(user_id);

CREATE TABLE IF NOT EXISTS compliance_requests (
  id bigserial PRIMARY KEY,
  request_type text NOT NULL, -- export/delete
  child_id uuid REFERENCES child_profiles(id),
  requested_by text NOT NULL,
  status text NOT NULL DEFAULT 'done',
  response_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

