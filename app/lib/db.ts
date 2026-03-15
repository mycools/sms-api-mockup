import Database from "better-sqlite3"

export const db = new Database("sms.db")

db.exec(`
CREATE TABLE IF NOT EXISTS sms_messages (
  id TEXT PRIMARY KEY,
  phone TEXT,
  message TEXT,
  sender TEXT,
  credit_used INTEGER,
  shorten_url INTEGER,
  tracking_url TEXT,
  short_url TEXT,
  expire TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)
db.exec(`
CREATE TABLE IF NOT EXISTS otp_requests (
  id TEXT PRIMARY KEY,
  token TEXT,
  refno TEXT,
  phone TEXT,
  pin TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified INTEGER DEFAULT 0
)
`)