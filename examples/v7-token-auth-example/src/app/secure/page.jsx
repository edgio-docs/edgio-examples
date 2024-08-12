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
      <h1 className="text-xl font-bold">Token Auth Landing Page</h1>
      <p>The following pages are protected by Token Auth:</p>
      <ul className="mt-2 list-disc list-inside ml-3">
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/static${token ? `?${token}` : ''}`}>Sample static page</Link></li>
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/dynamic${token ? `?${token}` : ''}`}>Sample dynamic page</Link></li>
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/generator${token ? `?${token}` : ''}`}>Generate and decode custom tokens</Link></li>
        <li><Link className="underline text-slate-400 hover:text-slate-800" href={`/secure/info${token ? `?${token}` : ''}`}>Decode the token used to access this page.</Link></li>
      </ul>
      <p className="mt-4">Generate a temporary token to access the above pages.</p>
      <button
        onClick={handleTokenClick}
        className="mt-2 p-3 rounded-md border-gray-300 shadow-sm bg-white dark:bg-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        Generate Token
      </button>
      {token !== '' && (<p className="mt-4">Use <code className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg border-2">{token}</code>. It's valid for 3 minutes from the time it was generated. The links above have been updated with that token.</p>)}
    </>
  )
}
