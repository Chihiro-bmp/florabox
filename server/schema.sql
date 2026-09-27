-- Run this in your Neon SQL editor to set up Florabox.
-- Safe to re-run: creates missing tables and migrates an older `cards` table in place.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(40) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  type        TEXT NOT NULL DEFAULT 'preset',   -- 'preset' | 'custom'
  preset_id   TEXT,                             -- e.g. 'birthday-marbled-rose'
  to_name     TEXT,
  from_name   TEXT,
  message     TEXT,
  music_id    TEXT,
  card_data   JSONB,                            -- custom card config
  theme       TEXT,                             -- drives the send animation
  created_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ
);

-- Migrate the original cards table (recipient_name / sender_name / design_id / stickers)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'recipient_name') THEN
    ALTER TABLE cards RENAME COLUMN recipient_name TO to_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'sender_name') THEN
    ALTER TABLE cards RENAME COLUMN sender_name TO from_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'design_id') THEN
    ALTER TABLE cards RENAME COLUMN design_id TO preset_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'stickers') THEN
    ALTER TABLE cards RENAME COLUMN stickers TO card_data;
  END IF;
END $$;

ALTER TABLE cards ADD COLUMN IF NOT EXISTS type       TEXT NOT NULL DEFAULT 'preset';
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_data  JSONB;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS theme      TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE cards ALTER COLUMN to_name   TYPE TEXT;
ALTER TABLE cards ALTER COLUMN from_name TYPE TEXT;
ALTER TABLE cards ALTER COLUMN preset_id TYPE TEXT;
ALTER TABLE cards ALTER COLUMN music_id  TYPE TEXT;
ALTER TABLE cards ALTER COLUMN card_data DROP DEFAULT;

CREATE TABLE IF NOT EXISTS bouquets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  recipient_name VARCHAR(100),
  sender_name VARCHAR(100),
  flowers JSONB DEFAULT '[]',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
