'use client';

import { Suspense, useState } from 'react'
import TokenAwareLink from '@/components/TokenAwareLink'
import { ECToken, encrypt, decrypt } from '@edgio/ectoken'

export default function SecurePage__Generator() {
  const [encodeKey, setEncodeKey] = useState(process.env.NEXT_PUBLIC_PRIMARY_TOKEN_KEY)
  const [decodeKey, setDecodeKey] = useState(process.env.NEXT_PUBLIC_PRIMARY_TOKEN_KEY)
  const [decodeToken, setDecodeToken] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')

  const tempToken = new ECToken()
  const tokenInputFields = Object.keys(tempToken.values)

  const updateEncodeKey = (e) => {
    setEncodeKey(e.target.value)
  }

  const updateDecodeKey = (e) => {
    setDecodeKey(e.target.value)
  }

  const updateDecodeToken = (e) => {
    setDecodeToken(e.target.value)
  }

  const calculatedDecodedToken = async (e) => {
    e.preventDefault()
    try {
      const decoded = await decrypt(decodeKey, decodeToken)
      setDecoded(decoded)
    } catch (err) {
      setDecoded('Error decoding token')
    }
  }

  const calculateEncodedToken = async (e) => {
    e.preventDefault()
    const { elements } = document.querySelector('#encodeForm')
    const tempToken = new ECToken()
    for (const element of elements) {
      let { value, name, nodeName } = element
      if (nodeName === 'INPUT' && name.startsWith('input_') && value !== '') {
        name = name.substring(6)
        const values = value.split(/, ?/)
        values.forEach(value => tempToken.addValue(name, value))
      }
    }

    try {
      const encoded = await encrypt(encodeKey, tempToken)
      setEncoded(encoded)
    } catch (err) {
      setEncoded('Error encoding token.')
    }
  }

  const noFormSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Suspense>
      <h1 className="text-xl font-bold">Token Generator/Decoder</h1>
      <p>On this page you can generate or decode arbitrary tokens with arbitrary keys.</p>
      <p className="font-bold">No information is set to the server; everything is encoded/decoded client-side.</p>

      <form onSubmit={noFormSubmit} className="mt-4 rounded-md border-2 border-slate-600 p-3" id="decodeForm">
        <h2 className="text-lg font-semibold">Decode Token</h2>
        <fieldset className="mb-2">
          <label htmlFor="decodeToken" className="block">
            <span>Enter the token to decode:</span>
            <textarea
              name="decodeToken"
              id="decodeToken"
              cols={80}
              rows={1}
              onChange={updateDecodeToken}
              className='bg-white dark:bg-slate-500 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            ></textarea>
          </label>
        </fieldset>
        <fieldset className="mb-2">
          <label htmlFor="decodeKey" className="block">
            <span>Enter the secret key:</span>
            <textarea
              name="decodeKey"
              id="decodeKey"
              cols="80"
              rows="1"
              value={decodeKey}
              onChange={updateDecodeKey}
              className="bg-white dark:bg-slate-500 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </label>
        </fieldset>
        <button
          onClick={calculatedDecodedToken}
          className="mb-4 p-3 rounded-md border-gray-300 shadow-sm bg-white dark:bg-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Decode Token
        </button>
        <fieldset className="mb-2">
          <label htmlFor="decodedPlaintext">
            <span>Token value:</span>
            <input
              type="text"
              name="decodedPlaintext"
              id="decodedPlaintext"
              disabled
              value={decoded}
              className="bg-white w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-slate-50 dark:bg-slate-600"
            />
          </label>
        </fieldset>
      </form>

      <form onSubmit={noFormSubmit} className="mt-4 rounded-md border-2 border-slate-600 p-3" id="encodeForm">
        <h2 className="text-lg font-semibold">Encode Token</h2>
        <div className="mb-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tokenInputFields.map(key => (
            <fieldset key={key}>
              <label htmlFor={`input_${key}`}>
                <span>{key}</span>
                <input
                  name={`input_${key}`}
                  id={`input_${key}`}
                  className="bg-white dark:bg-slate-500 w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-slate-50 dark:bg-slate-600"
                />
              </label>
            </fieldset>
          ))}
        </div>

        <fieldset className="mb-2">
          <label htmlFor="encodeKey" className="block">
            <span>Enter the secret key:</span>
            <textarea
              name="encodeKey"
              id="encodeKey"
              cols="80"
              rows="1"
              value={encodeKey}
              onChange={updateEncodeKey}
              className="bg-white dark:bg-slate-500 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </label>
        </fieldset>

        <button
          onClick={calculateEncodedToken}
          className="mb-4 p-3 rounded-md border-gray-300 shadow-sm bg-white dark:bg-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Encode Token
        </button>

        <fieldset className="mb-2">
          <label htmlFor="encodedPlaintext">
            <span>Token value:</span>
            <input
              type="text"
              name="encodedPlaintext"
              id="encodedPlaintext"
              disabled
              value={encoded}
              className="bg-white dark:bg-slate-500 w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-slate-50"
            />
          </label>
        </fieldset>
      </form>

      <p className="mt-4"><TokenAwareLink className="underline text-slate-400 hover:text-slate-800" href="/secure">Return to the Token Auth landing page.</TokenAwareLink></p>
    </Suspense>
  )
}
