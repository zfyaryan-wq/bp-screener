CREATE TABLE IF NOT EXISTS bp_project_status (
  document_id INTEGER PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'new',
  note TEXT NOT NULL DEFAULT '',
  set_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS bp_marks (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  mark TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, actor, mark),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS bp_votes (
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  vote TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(document_id, actor),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS bp_shortlist_items (
  owner TEXT NOT NULL,
  document_id INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(owner, document_id),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS weekly_nominations (
  id INTEGER PRIMARY KEY,
  week_start TEXT NOT NULL,
  document_id INTEGER NOT NULL,
  nominator TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(week_start, nominator, document_id),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS nomination_votes (
  nomination_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  vote TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(nomination_id, actor),
  FOREIGN KEY(nomination_id) REFERENCES weekly_nominations(id)
);

CREATE TABLE IF NOT EXISTS meeting_events (
  id INTEGER PRIMARY KEY,
  week_start TEXT NOT NULL,
  event_date TEXT NOT NULL,
  type TEXT NOT NULL,
  document_id INTEGER,
  title TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  actor TEXT NOT NULL DEFAULT '',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS daily_activity (
  day TEXT NOT NULL,
  actor TEXT NOT NULL,
  document_id INTEGER NOT NULL DEFAULT 0,
  action TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(day, actor, document_id, action)
);

CREATE INDEX IF NOT EXISTS idx_bp_project_status_status ON bp_project_status(status);
CREATE INDEX IF NOT EXISTS idx_bp_marks_document_actor ON bp_marks(document_id, actor);
CREATE INDEX IF NOT EXISTS idx_bp_votes_document_vote ON bp_votes(document_id, vote);
CREATE INDEX IF NOT EXISTS idx_bp_shortlist_owner_position ON bp_shortlist_items(owner, position);
CREATE INDEX IF NOT EXISTS idx_weekly_nominations_week ON weekly_nominations(week_start, created_at);
CREATE INDEX IF NOT EXISTS idx_nomination_votes_vote ON nomination_votes(vote);
CREATE INDEX IF NOT EXISTS idx_meeting_events_week_date ON meeting_events(week_start, event_date);
CREATE INDEX IF NOT EXISTS idx_daily_activity_day_actor ON daily_activity(day, actor);
