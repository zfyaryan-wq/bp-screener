CREATE TABLE IF NOT EXISTS weight_factors (
  id INTEGER PRIMARY KEY,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'overall_fit',
  scope TEXT NOT NULL DEFAULT 'personal',
  owner TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source_prompt TEXT NOT NULL DEFAULT '',
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_weight_factors_scope_updated
  ON weight_factors(scope, updated_at);

CREATE INDEX IF NOT EXISTS idx_weight_factors_owner_updated
  ON weight_factors(owner, updated_at);

CREATE INDEX IF NOT EXISTS idx_weight_factors_key
  ON weight_factors(key);
