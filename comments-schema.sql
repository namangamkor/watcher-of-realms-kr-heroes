-- WoR Wiki 2.12.0 / Run once in the dedicated COMMENTS_DB database.
-- Additive and safe to run again; no hero data is stored or changed here.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  hero_id TEXT NOT NULL,
  nickname TEXT NOT NULL CHECK (length(nickname) BETWEEN 2 AND 20),
  awakening INTEGER CHECK (awakening IS NULL OR awakening BETWEEN 0 AND 5),
  body TEXT NOT NULL CHECK (length(body) BETWEEN 5 AND 500),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','hidden')),
  author_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  published_at INTEGER,
  updated_at INTEGER NOT NULL,
  version INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_comments_public ON comments(hero_id, status, published_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_comments_queue ON comments(status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_hash, hero_id, created_at DESC);
CREATE TABLE IF NOT EXISTS comment_reports (
  id INTEGER PRIMARY KEY,
  comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reporter_hash TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam','abuse','misinformation','other')),
  created_at INTEGER NOT NULL,
  resolved_at INTEGER,
  UNIQUE(comment_id, reporter_hash)
);
CREATE INDEX IF NOT EXISTS idx_comment_reports_open ON comment_reports(resolved_at, comment_id);
CREATE TABLE IF NOT EXISTS comment_rate_limits (
  key TEXT PRIMARY KEY,
  last_at INTEGER NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comment_rate_limits_expiry ON comment_rate_limits(last_at);
CREATE TABLE IF NOT EXISTS comment_moderation_log (
  id TEXT PRIMARY KEY,
  comment_id TEXT NOT NULL,
  action TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comment_moderation_log_created ON comment_moderation_log(created_at);
