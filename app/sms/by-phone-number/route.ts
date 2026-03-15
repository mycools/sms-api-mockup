import { NextRequest, NextResponse } from "next/server"
import { db } from "../../lib/db"

function normalizePhone(num: string) {
  if (num.startsWith("+")) return num.substring(1)

  if (num.startsWith("0")) {
    return "66" + num.substring(1)
  }

  return num
}

export async function GET(req: NextRequest) {

  const phoneParam = req.nextUrl.searchParams.get("phone")

  if (!phoneParam) {
    return NextResponse.json(
      { error: "phone parameter required" },
      { status: 400 }
    )
  }

  const phone = normalizePhone(phoneParam)

  const rows = db.prepare(`
    SELECT
      id as message_id,
      phone as number,
      message,
      sender,
      credit_used,
      shorten_url,
      tracking_url,
      expire,
      created_at
    FROM sms_messages
    WHERE phone = ?
    ORDER BY created_at DESC
    LIMIT 100
  `).all(phone)

  return NextResponse.json({
    phone,
    total: rows.length,
    data: rows
  })
}