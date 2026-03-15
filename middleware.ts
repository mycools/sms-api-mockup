import { NextRequest, NextResponse } from "next/server"

const BASIC_USER = "test"
const BASIC_PASS = "test"

const API_KEY = "test"
const SECRET_KEY = "test"

function unauthorizedBasic() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  })
}

function unauthorizedApi() {
  return new NextResponse(
    JSON.stringify({ error: "Unauthorized" }),
    {
      status: 401,
      headers: { "content-type": "application/json" },
    }
  )
}

function verifyBasicAuth(auth?: string) {
  if (!auth?.startsWith("Basic ")) return false

  const base64 = auth.split(" ")[1]
  const [user, pass] = Buffer.from(base64, "base64")
    .toString()
    .split(":")

  return user === BASIC_USER && pass === BASIC_PASS
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  /*
  ---------------------------------
  BASIC AUTH ROUTES
  /sms
  /v2/otp/*
  /credit
  ---------------------------------
  */

  if (path.startsWith("/sms") || path.startsWith("/v2/otp") || path.startsWith("/credit")) {
    const auth : string | null = req.headers.get("authorization")
    if(!auth) {
      return unauthorizedBasic()
    }
    
    if (!verifyBasicAuth(auth)) {
      return unauthorizedBasic()
    }
  }

  /*
  ---------------------------------
  API KEY ROUTES
  /api/*
  ---------------------------------
  */

  if (path.startsWith("/api")) {
    const apiKey = req.headers.get("api_key")
    const secretKey = req.headers.get("secret_key")

    if (apiKey !== API_KEY || secretKey !== SECRET_KEY) {
      return unauthorizedApi()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/sms",
    "/v2/otp/:path*",
    "/credit",
    "/api/:path*",
  ],
}