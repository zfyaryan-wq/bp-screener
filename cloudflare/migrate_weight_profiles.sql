CREATE TABLE IF NOT EXISTS weight_profiles (
  id INTEGER PRIMARY KEY,
  owner TEXT NOT NULL,
  title TEXT NOT NULL,
  factors_json TEXT NOT NULL DEFAULT '[]',
  prompt TEXT NOT NULL DEFAULT '',
  source_profile_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE IF NOT EXISTS weight_profile_likes (
  profile_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(profile_id, actor),
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE IF NOT EXISTS weight_profile_comments (
  id INTEGER PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE IF NOT EXISTS weight_profile_events (
  id INTEGER PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_weight_profiles_owner_updated
  ON weight_profiles(owner, updated_at);

CREATE INDEX IF NOT EXISTS idx_weight_profiles_updated
  ON weight_profiles(updated_at);

CREATE INDEX IF NOT EXISTS idx_weight_profile_comments_profile
  ON weight_profile_comments(profile_id, created_at);

CREATE INDEX IF NOT EXISTS idx_weight_profile_events_profile
  ON weight_profile_events(profile_id, created_at);
