import Database from "better-sqlite3"
import { createClient } from "@libsql/client";

// export const db = new Database("sms.db")
export const db = createClient({
  url: process.env.SMS_TURSO_DATABASE_URL!,
  authToken: process.env.SMS_TURSO_AUTH_TOKEN!
})

db.execute(`
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
db.execute(`
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