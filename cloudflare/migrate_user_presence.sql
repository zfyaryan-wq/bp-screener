CREATE TABLE IF NOT EXISTS user_presence (
  user_name TEXT PRIMARY KEY,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_page TEXT NOT NULL DEFAULT '',
  document_id INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON user_presence(last_seen_at);
