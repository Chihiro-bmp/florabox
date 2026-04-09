-- Run this in your Neon SQL editor to set up Florabox

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(40) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  recipient_name VARCHAR(100),
  sender_name VARCHAR(100),
  message TEXT,
  design_id VARCHAR(50),
  music_id VARCHAR(50),
  stickers JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bouquets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  recipient_name VARCHAR(100),
  sender_name VARCHAR(100),
  flowers JSONB DEFAULT '[]',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
