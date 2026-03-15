"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {

  const router = useRouter()
  const [phone, setPhone] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!phone) return

    router.push(`/inbox/${encodeURIComponent(phone)}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-[360px]">

        <h1 className="text-2xl font-semibold text-center mb-6">
          SMS Inbox
        </h1>

        <form onSubmit={submit} className="space-y-4">

          <input
            type="text"
            placeholder="0812345678"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className="
              w-full
              border
              border-neutral-300
              rounded-lg
              px-4
              py-3
              text-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <button
            className="
              w-full
              bg-blue-600
              text-white
              py-3
              rounded-lg
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            View SMS
          </button>

        </form>

      </div>

    </main>
  )
}