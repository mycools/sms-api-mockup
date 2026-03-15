"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import { useMemo, useState } from "react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Page() {

  const params = useParams<{ phone: string }>()

  const { data } = useSWR(
    `/sms/by-phone-number?phone=${params.phone}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const [selected, setSelected] = useState<string | null>(null)

  const senders = useMemo(() => {

    if (!data) return []

    const map: any = {}

    data.data.forEach((m: any) => {

      if (!map[m.sender]) {
        map[m.sender] = {
          sender: m.sender,
          last: m.message,
          time: m.created_at
        }
      }

    })

    return Object.values(map)

  }, [data])

  const messages =
    data?.data.filter((m: any) => m.sender === selected) ?? []

  return (

    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}

      <aside className="w-80 bg-white border-r">

        <div className="p-5 font-semibold text-lg border-b">
          Inbox {params.phone}
        </div>

        <div className="overflow-y-auto">

          {senders.map((s: any) => (

            <button
              key={s.sender}
              onClick={() => setSelected(s.sender)}
              className={`
                flex w-full items-center gap-3 p-4 border-b
                hover:bg-gray-100 text-left
                ${selected === s.sender ? "bg-gray-100" : ""}
              `}
            >

              <img
                className="w-10 h-10 rounded-full"
                src={`https://ui-avatars.com/api/?name=${s.sender}`}
              />

              <div className="flex-1">

                <div className="flex justify-between text-sm font-medium">

                  <span>{s.sender}</span>

                  <span className="text-xs text-gray-400">
                    {s.time}
                  </span>

                </div>

                <p className="text-sm text-gray-500 truncate max-w-[250px]">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap block max-w-full text-xs">
                  {s.last}
                  </span>
                </p>

              </div>

            </button>

          ))}

        </div>

      </aside>

      {/* CHAT */}

      <main className="flex-1 flex flex-col">

        {!selected && (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select conversation
          </div>
        )}

        {selected && (
          <>
            {/* HEADER */}

            <div className="flex items-center gap-3 p-4 border-b bg-white">

              <img
                className="w-10 h-10 rounded-full"
                src={`https://ui-avatars.com/api/?name=${selected}`}
              />

              <span className="font-semibold">{selected}</span>

            </div>

            {/* MESSAGE LIST */}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {messages.map((m: any) => {

                const otp = m.message.match(/\d{4,6}/)

                return (

                  <div key={m.message_id} className="flex">

                    <div className="max-w-xl bg-white shadow rounded-xl p-4">

                      <p className="text-sm">

                        {m.message}

                        {/* {otp && (
                          <span className="ml-2 font-mono font-bold text-blue-600">
                            {otp[0]}
                          </span>
                        )} */}

                      </p>

                      <span className="text-xs text-gray-400">
                        {m.created_at}
                      </span>

                    </div>

                  </div>

                )

              })}

            </div>

          </>
        )}

      </main>

    </div>

  )
}