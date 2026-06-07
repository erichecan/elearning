-- Phase 6 extension: parental consent workflow (COPPA)

CREATE TABLE IF NOT EXISTS parental_consents (
  id bigserial PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  guardian_name text NOT NULL,
  relationship text,
  consent_version text NOT NULL DEFAULT 'v1',
  consent_method text NOT NULL DEFAULT 'checkbox',
  scope jsonb NOT NULL DEFAULT '{}'::jsonb,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  revoke_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parental_consents_child
  ON parental_consents(child_id);

CREATE INDEX IF NOT EXISTS idx_parental_consents_active
  ON parental_consents(child_id, revoked_at);
