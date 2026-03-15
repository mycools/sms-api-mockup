"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation';
import useSWR from "swr"

const fetcher = (url:string)=>fetch(url).then(r=>r.json())

export default function Page() {
    const params = useParams<{ phone: string }>();
    const { data, error } = useSWR(`/sms/by-phone-number?phone=${params.phone}`, fetcher)
    useEffect(() => {
        document.title = `Inbox ${params.phone}`
    }, [params.phone])
  



    return (

        <main className="p-10">

            <h1 className="text-2xl font-semibold mb-6">
                Inbox {params.phone}
            </h1>

            <table className="w-full border">

                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">Time</th>
                        <th className="p-2">Sender</th>
                        <th className="p-2">Message</th>
                    </tr>
                </thead>

                <tbody>
                    {data ? data.data.map((sms: any) => (
                        <tr key={sms.message_id}>
                            <td className="p-2">{sms.created_at}</td>
                            <td className="p-2">{sms.sender}</td>
                            <td className="p-2">{sms.message}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="p-2 text-center">
                                No messages found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

        </main>
    )
}