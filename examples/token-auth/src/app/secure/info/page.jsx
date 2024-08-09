'use client';

import { decrypt } from '@edgio/ectoken'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import TokenAwareLink from '@/components/TokenAwareLink'

function SecurePage__InfoComponent() {
  const params = useSearchParams()
  const matches = []
  for (const key of params.keys()) {
    const val = params.get(key)
    if (val === '') {
      matches.push(key)
    }
  }

  const [key, setKey] = useState(process.env.NEXT_PUBLIC_PRIMARY_TOKEN_KEY)
  const [decoded, setDecoded] = useState([])

  const decode = async () => {
    setDecoded([])
  
    const tempDecoded = []
  
    for (const token of matches) {
      try {
        const _decoded = await decrypt(key, token)
        tempDecoded.push({ token, decoded: _decoded })
      } catch (err) {
        tempDecoded.push({ token, decoded: 'n/a' })
      }
    }
  
    setDecoded(tempDecoded)
  }

  useEffect(() => {
    decode()
  }, [key])

  /**
   * Save the given key to state.
   * @param {Event} e The event handler from the caller.
   */
  const handleKeyChange = (e) => {
    setKey(e.target.value)
  }

  /**
   * Recalculate all found tokens in the QS.
   * @param {Event} e The event handler from the caller.
   */
  const recalculate = async (e) => {
    e.preventDefault()
    await decode()
  }

  return (
    <>
      <h1 className="text-xl font-bold">Token Information</h1>
      <p>This page will attempt to decode the token(s) present in the URL.</p>
      <p className="font-bold">No information is set to the server; everything is decoded client-side.</p>

      <form className="mt-4" onSubmit={recalculate}>
        <fieldset className="mb-2">
          <label className="block" htmlFor="key">
            <span>Enter your key:</span>
            <textarea
              name="key"
              id="key"
              cols="80"
              rows="1"
              onChange={handleKeyChange}
              value={key}
              className="bg-white dark:bg-slate-500 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </label>
        </fieldset>
        <button
          onClick={recalculate}
          className="p-3 rounded-md border-gray-300 shadow-sm bg-white dark:bg-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >Recalculate with this key</button>
      </form>

      <div className="relative rounded-xl overflow-auto bg-slate-50 dark:bg-slate-600 mt-8">
        <div className="shadow-sm overflow-hidden my-4">
          <table className="border-collapse w-full table-auto">
            <thead>
              <tr>
                <th className="border-b border-slate-600 dark:border-slate-50 p-4 pl-8 pt-0 pb-3 text-left">Encoded Token</th>
                <th className="border-b border-slate-600 dark:border-slate-50 p-4 pl-8 pt-0 pb-3 text-left">Plaintext</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-50 dark:bg-slate-600">
              {decoded.map(tokenPair => (
                <tr key={tokenPair.token}>
                  <td className="px-2 border-r">{tokenPair.token}</td>
                  <td className="px-2">{tokenPair.decoded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4"><TokenAwareLink className="underline text-slate-400 hover:text-slate-800" href="/secure">Return to the Token Auth landing page.</TokenAwareLink></p>
    </>
  )
}

export default function SearchPage__Info() {
  return (
    <Suspense>
      <SecurePage__InfoComponent />
    </Suspense>
  )
}