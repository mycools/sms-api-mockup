import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"

export async function POST(req: NextRequest) {

  const form = await req.formData()

  const key = form.get("key")?.toString()
  const secret = form.get("secret")?.toString()
  const token = form.get("token")?.toString()
  const pin = form.get("pin")?.toString()

  if (!key || !secret || !token || !pin) {

    return NextResponse.json({
      errors: ["missing parameters"],
      code: 400
    }, { status: 400 })

  }

  const row:any = db.prepare(`
    SELECT * FROM otp_requests
    WHERE token = ?
  `).get(token)

  if (!row) {

    return NextResponse.json({
      errors: ["token not found"],
      code: 1001
    }, { status: 400 })

  }

  // expire after 5 minutes

  const createdAt = new Date(row.created_at)
  const now = new Date()

  const diff = (now.getTime() - createdAt.getTime()) / 1000

  if (diff > 5 * 60) {

    return NextResponse.json({
      errors: ["token expired"],
      code: 1003
    }, { status: 400 })

  }

  if (row.pin !== pin) {

    return NextResponse.json({
      errors: ["invalid otp"],
      code: 1002
    }, { status: 400 })

  }

  db.prepare(`
    UPDATE otp_requests
    SET verified = 1
    WHERE token = ?
  `).run(token)

  return NextResponse.json({
    status: "success",
    message: "OTP verified"
  })
}