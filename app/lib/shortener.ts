import crypto from "crypto"

export function generateShortCode() {
  return crypto.randomBytes(4).toString("hex")
}

export function shortenMessage(message: string, trackingUrl?: string) {

  const urlRegex = /(https?:\/\/[^\s]+)/g

  return message.replace(urlRegex, (url) => {

    if (url.length <= 25) return url

    const code = generateShortCode()

    return `https://s.to/${code}`
  })
}