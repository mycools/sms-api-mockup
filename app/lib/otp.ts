import crypto from "crypto"

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateToken() {
  return crypto.randomBytes(16).toString("hex")
}

export function generateRefno() {
    // 6 characters hex string
  return crypto.randomBytes(6).toString("hex").substring(0, 6)
}