CREATE TABLE IF NOT EXISTS bp_ai_analysis_artifacts (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL DEFAULT '',
  artifact_type TEXT NOT NULL DEFAULT 'brief',
  lang TEXT NOT NULL DEFAULT 'en',
  profile_id INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  input_hash TEXT NOT NULL DEFAULT '',
  prompt_version TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'succeeded',
  artifact_json TEXT NOT NULL DEFAULT '{}',
  sources_json TEXT NOT NULL DEFAULT '[]',
  confidence_json TEXT,
  warnings_json TEXT,
  feedback_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id),
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_bp_ai_analysis_latest
  ON bp_ai_analysis_artifacts(document_id, artifact_type, lang, status, updated_at);

CREATE INDEX IF NOT EXISTS idx_bp_ai_analysis_actor_updated
  ON bp_ai_analysis_artifacts(actor, updated_at);
