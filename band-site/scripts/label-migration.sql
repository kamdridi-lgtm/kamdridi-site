CREATE TABLE IF NOT EXISTS label_stream_stats (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL,
  release_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  month TEXT NOT NULL,
  streams INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS label_generated_codes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  artist_id TEXT,
  release_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS label_payout_history (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  threshold_cents INTEGER NOT NULL,
  status TEXT NOT NULL,
  transfer_id TEXT,
  receipt_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS label_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  body TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS label_contracts (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  html TEXT NOT NULL,
  accepted BOOLEAN NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL,
  ip_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_label_stream_stats_artist ON label_stream_stats(artist_id);
CREATE INDEX IF NOT EXISTS idx_label_messages_conversation ON label_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_label_contracts_artist ON label_contracts(artist_id);
