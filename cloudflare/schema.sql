DROP TABLE IF EXISTS chunks;
DROP TABLE IF EXISTS project_translations;
DROP TABLE IF EXISTS daily_activity;
DROP TABLE IF EXISTS meeting_events;
DROP TABLE IF EXISTS nomination_votes;
DROP TABLE IF EXISTS weekly_nominations;
DROP TABLE IF EXISTS bp_shortlist_items;
DROP TABLE IF EXISTS bp_votes;
DROP TABLE IF EXISTS bp_marks;
DROP TABLE IF EXISTS bp_project_status;
DROP TABLE IF EXISTS bp_reactions;
DROP TABLE IF EXISTS bp_activity;
DROP TABLE IF EXISTS bp_comments;
DROP TABLE IF EXISTS account_access_codes;
DROP TABLE IF EXISTS bp_ai_analysis_artifacts;
DROP TABLE IF EXISTS bp_user_scores;
DROP TABLE IF EXISTS bp_score_drafts;
DROP TABLE IF EXISTS weight_factors;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS ingest_jobs;
DROP TABLE IF EXISTS documents;

CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  file_name TEXT NOT NULL,
  source_url TEXT,
  file_size INTEGER NOT NULL DEFAULT 0,
  source_platform TEXT NOT NULL DEFAULT '',
  source_external_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE ingest_jobs (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  source_platform TEXT NOT NULL DEFAULT '',
  source_external_id TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  claimed_at TEXT,
  completed_at TEXT,
  UNIQUE(document_id),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  country_or_region TEXT NOT NULL DEFAULT '未知',
  ai_related INTEGER NOT NULL DEFAULT 0,
  ai_category TEXT NOT NULL DEFAULT '[]',
  financing_stage TEXT NOT NULL,
  business_model TEXT NOT NULL,
  customer_type TEXT NOT NULL DEFAULT '未知',
  revenue_stage TEXT NOT NULL DEFAULT '未知',
  team_highlights TEXT NOT NULL DEFAULT '[]',
  traction TEXT NOT NULL DEFAULT '[]',
  customers_or_users TEXT NOT NULL,
  revenue_or_financials TEXT NOT NULL,
  one_line_summary TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  screening_score INTEGER NOT NULL DEFAULT 0,
  team_score INTEGER NOT NULL DEFAULT 0,
  traction_score INTEGER NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT '未知',
  risks TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  evidence TEXT NOT NULL DEFAULT '[]',
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE chunks (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  page INTEGER,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE project_translations (
  document_id INTEGER NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  profile_json TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  PRIMARY KEY(document_id, lang),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE weight_profiles (
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

CREATE TABLE weight_factors (
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

CREATE TABLE weight_profile_likes (
  profile_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(profile_id, actor),
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE weight_profile_comments (
  id INTEGER PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE weight_profile_events (
  id INTEGER PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
);

CREATE TABLE account_access_codes (
  actor TEXT PRIMARY KEY,
  salt TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bp_score_drafts (
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

CREATE TABLE bp_user_scores (
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

CREATE TABLE bp_ai_analysis_artifacts (
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

CREATE TABLE bp_comments (
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

CREATE TABLE bp_activity (
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

CREATE TABLE bp_reactions (
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

CREATE TABLE bp_project_status (
  document_id INTEGER PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'new',
  note TEXT NOT NULL DEFAULT '',
  set_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE bp_marks (
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

CREATE TABLE bp_votes (
  document_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  vote TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(document_id, actor),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE bp_shortlist_items (
  owner TEXT NOT NULL,
  document_id INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(owner, document_id),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE weekly_nominations (
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

CREATE TABLE nomination_votes (
  nomination_id INTEGER NOT NULL,
  actor TEXT NOT NULL,
  vote TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(nomination_id, actor),
  FOREIGN KEY(nomination_id) REFERENCES weekly_nominations(id)
);

CREATE TABLE meeting_events (
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

CREATE TABLE daily_activity (
  day TEXT NOT NULL,
  actor TEXT NOT NULL,
  document_id INTEGER NOT NULL DEFAULT 0,
  action TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(day, actor, document_id, action)
);

CREATE INDEX idx_projects_ai_related ON projects(ai_related);
CREATE INDEX idx_projects_industry ON projects(industry);
CREATE INDEX idx_projects_country ON projects(country_or_region);
CREATE INDEX idx_projects_customer_type ON projects(customer_type);
CREATE INDEX idx_projects_revenue_stage ON projects(revenue_stage);
CREATE INDEX idx_projects_stage ON projects(financing_stage);
CREATE INDEX idx_projects_recommendation ON projects(recommendation);
CREATE INDEX idx_projects_screening_score ON projects(screening_score);
CREATE INDEX idx_projects_risk_level ON projects(risk_level);
CREATE INDEX idx_chunks_document_id ON chunks(document_id);
CREATE INDEX idx_project_translations_lang ON project_translations(lang);
CREATE INDEX idx_documents_status_updated ON documents(status, updated_at);
CREATE INDEX idx_documents_source_external ON documents(source_platform, source_external_id);
CREATE INDEX idx_ingest_jobs_status_created ON ingest_jobs(status, created_at);
CREATE INDEX idx_ingest_jobs_document_id ON ingest_jobs(document_id);
CREATE INDEX idx_weight_factors_scope_updated ON weight_factors(scope, updated_at);
CREATE INDEX idx_weight_factors_owner_updated ON weight_factors(owner, updated_at);
CREATE INDEX idx_weight_factors_key ON weight_factors(key);
CREATE INDEX idx_weight_profiles_owner_updated ON weight_profiles(owner, updated_at);
CREATE INDEX idx_weight_profiles_updated ON weight_profiles(updated_at);
CREATE INDEX idx_bp_score_drafts_actor_updated ON bp_score_drafts(actor, updated_at);
CREATE INDEX idx_bp_user_scores_actor_updated ON bp_user_scores(actor, updated_at);
CREATE INDEX idx_weight_profile_comments_profile ON weight_profile_comments(profile_id, created_at);
CREATE INDEX idx_weight_profile_events_profile ON weight_profile_events(profile_id, created_at);
CREATE INDEX idx_account_access_codes_updated ON account_access_codes(updated_at);
CREATE INDEX idx_bp_comments_document_created ON bp_comments(document_id, created_at);
CREATE INDEX idx_bp_comments_actor ON bp_comments(actor);
CREATE INDEX idx_bp_activity_actor_status ON bp_activity(actor, status);
CREATE INDEX idx_bp_reactions_document_reaction ON bp_reactions(document_id, reaction, target_type);
CREATE INDEX idx_bp_project_status_status ON bp_project_status(status);
CREATE INDEX idx_bp_marks_document_actor ON bp_marks(document_id, actor);
CREATE INDEX idx_bp_votes_document_vote ON bp_votes(document_id, vote);
CREATE INDEX idx_bp_shortlist_owner_position ON bp_shortlist_items(owner, position);
CREATE INDEX idx_weekly_nominations_week ON weekly_nominations(week_start, created_at);
CREATE INDEX idx_nomination_votes_vote ON nomination_votes(vote);
CREATE INDEX idx_meeting_events_week_date ON meeting_events(week_start, event_date);
CREATE INDEX idx_daily_activity_day_actor ON daily_activity(day, actor);
