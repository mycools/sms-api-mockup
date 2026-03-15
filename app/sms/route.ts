import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "../lib/db"
import { shortenMessage } from "../lib/shortener"

function messageId() {
  return crypto.randomBytes(12).toString("base64url")
}

function normalizePhone(num: string) {

  if (num.startsWith("+")) return num.substring(1)

  if (num.startsWith("0")) {
    return "66" + num.substring(1)
  }

  return num
}

function validPhone(num: string) {
  return /^66\d{9}$/.test(num)
}

function parseExpire(expire?: string) {

  if (!expire) return null

  const [h, m] = expire.split(":").map(Number)

  const minutes = h * 60 + m

  if (minutes < 5 || minutes > 660) {
    throw new Error("expire must be between 5 minutes and 11 hours")
  }

  return expire
}

export async function POST(req: NextRequest) {

  const form = await req.formData()

  const msisdn = form.get("msisdn")?.toString()
  const message = form.get("message")?.toString()
  const sender = form.get("sender")?.toString()

  const shortenUrl = form.get("shorten_url")?.toString() === "true"
  const trackingUrl = form.get("tracking_url")?.toString()
  const expire = form.get("expire")?.toString()

  if (!msisdn || !message || !sender) {
    return NextResponse.json(
      { error: "msisdn, message, sender required" },
      { status: 400 }
    )
  }

  const expireValue = parseExpire(expire)

  const numbers = msisdn.split(",").map(v => v.trim())

  const badList:any[] = []
  const okList:any[] = []

  for (const raw of numbers) {

    const phone = normalizePhone(raw)

    if (!validPhone(phone)) {

      badList.push({
        message: "Phone number is invalid.",
        number: phone
      })

      continue
    }

    let finalMessage = message

    if (shortenUrl) {
      finalMessage = shortenMessage(message, trackingUrl)
    }

    const id = messageId()

    db.execute({
      sql: `
        INSERT INTO sms_messages
        (id, phone, message, sender, credit_used, shorten_url, tracking_url, expire)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [id, phone, finalMessage, sender, 1, shortenUrl ? 1 : 0, trackingUrl || null, expireValue]
    })

    okList.push({
      message_id: id,
      number: phone,
      used_credit: 1
    })
  }

  const totalUseCredit = okList.length

  const remainingCredit = 156758 - totalUseCredit

  return NextResponse.json(
    {
      bad_phone_number_list: badList,
      credit_type: "corporate",
      phone_number_list: okList,
      remaining_credit: remainingCredit,
      total_use_credit: totalUseCredit
    },
    { status: 201 }
  )
}