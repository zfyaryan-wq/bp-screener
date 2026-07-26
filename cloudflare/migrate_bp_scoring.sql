CREATE TABLE IF NOT EXISTS bp_score_drafts (
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  template_key TEXT NOT NULL DEFAULT 'type_a',
  profile_id INTEGER,
  draft_score INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  uncertainty TEXT NOT NULL DEFAULT '',
  dimensions_json TEXT NOT NULL DEFAULT '[]',
  source TEXT NOT NULL DEFAULT 'fallback',
  model TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(document_id, actor, template_key),
  FOREIGN KEY(document_id) REFERENCES documents(id),
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE IF NOT EXISTS bp_user_scores (
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  template_key TEXT NOT NULL DEFAULT 'type_a',
  profile_id INTEGER,
  ai_draft_score INTEGER NOT NULL DEFAULT 0,
  ai_reason TEXT NOT NULL DEFAULT '',
  user_final_score INTEGER NOT NULL DEFAULT 0,
  user_adjustment INTEGER NOT NULL DEFAULT 0,
  adjustment_reason TEXT NOT NULL DEFAULT '',
  dimensions_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(document_id, actor, template_key),
  FOREIGN KEY(document_id) REFERENCES documents(id),
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_bp_score_drafts_actor_updated
  ON bp_score_drafts(actor, updated_at);

CREATE INDEX IF NOT EXISTS idx_bp_user_scores_actor_updated
  ON bp_user_scores(actor, updated_at);
