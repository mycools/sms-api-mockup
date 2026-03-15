import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { generateOTP, generateToken, generateRefno } from "../../../lib/otp"

function normalizePhone(num: string) {

  if (num.startsWith("+")) return num.substring(1)

  if (num.startsWith("0")) {
    return "66" + num.substring(1)
  }

  return num
}

export async function POST(req: NextRequest) {

  const form = await req.formData()

  const key = form.get("key")?.toString()
  const secret = form.get("secret")?.toString()
  const msisdn = form.get("msisdn")?.toString()

  if (!key || !secret || !msisdn) {

    return NextResponse.json({
      errors: ["missing parameters"],
      code: 400
    }, { status: 400 })

  }

  const phone = normalizePhone(msisdn)

  const pin = generateOTP()
  const token = generateToken()
  const refno = generateRefno()
const message = `รหัสยืนยันของคุณคือ ${pin} (Ref : ${refno})`

  db.execute({ sql : `
    INSERT INTO otp_requests
    (id, token, refno, phone, pin)
    VALUES (?, ?, ?, ?, ?)
  `, args: [token, token, refno, phone, pin] })

  /*
  ------------------------
  insert SMS message
  ------------------------
  */

  db.execute({ sql : `
    INSERT INTO sms_messages
    (id, phone, message, sender, credit_used)
    VALUES (?, ?, ?, ?, ?)
  `, args: [token, phone, message, "OTP", 1] })

  // ตรงนี้ normally จะยิง SMS
  console.log(`OTP for ${phone}: ${pin}`)

  return NextResponse.json({
    status: "success",
    token,
    refno
  })
}