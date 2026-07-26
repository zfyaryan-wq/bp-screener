CREATE TABLE IF NOT EXISTS bp_comments (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'comment',
  content TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS bp_activity (
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'viewed',
  viewed_at TEXT,
  commented_at TEXT,
  asked_at TEXT,
  not_interested_at TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(document_id, actor),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS bp_reactions (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  reaction TEXT NOT NULL,
  target_type TEXT NOT NULL DEFAULT 'project',
  target_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, actor, reaction, target_type, target_id),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_bp_comments_document_created ON bp_comments(document_id, created_at);
CREATE INDEX IF NOT EXISTS idx_bp_comments_actor ON bp_comments(actor);
CREATE INDEX IF NOT EXISTS idx_bp_activity_actor_status ON bp_activity(actor, status);
CREATE INDEX IF NOT EXISTS idx_bp_reactions_document_reaction
  ON bp_reactions(document_id, reaction, target_type);
