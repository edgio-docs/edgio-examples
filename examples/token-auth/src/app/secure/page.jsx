'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const getToken = async () => {
  const resp = await fetch('/api/token')
  const token = await resp.json()
  return token
}

export default function SecurePage() {
  const [token, setToken] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    for (const [key, value] of urlParams) {
      if (value === '') {
        setToken(key)
        break;
      }
    }
  })

  const handleTokenClick = async (e) => {
    const fetched = await getToken()
    setToken(fetched.token)
  }

  return (
    <>
      <h1 className="text-xl font-bold">Landing Page</h1>
      <p>The following pages are protected by Token Auth:</p>
      <ul className="mt-2 list-disc list-inside ml-3">
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/static${token ? `?${token}` : ''}`}>Static page</Link></li>
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/dynamic${token ? `?${token}` : ''}`}>Dynamic page</Link></li>
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/generator${token ? `?${token}` : ''}`}>Client-side Token Generator/Decoder</Link></li>
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/info${token ? `?${token}` : ''}`}>Decode the token used to access this page (requires secret key)</Link></li>
<Link className="underline text-slate-400 hover:text-slate-800" href="/">Return to the homepage.</Link>
      </ul>
      <p className="mt-4">Need a token to get started? Click the button below to generate one.</p>
      <button
        onClick={handleTokenClick}
        className="mt-2 p-3 rounded-md border-gray-300 shadow-sm bg-white dark:bg-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        Generate a temporary token
      </button>
      {token !== '' && (<p className="mt-4">Use <code className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg border-2">{token}</code>. It's valid for 3 minutes from the time it was generated. The links above have been updated with that token.</p>)}
      <p><Link className="underline text-slate-400 hover:text-slate-800" href="/">Return to the homepage.</Link></p>
    </>
  )
}
