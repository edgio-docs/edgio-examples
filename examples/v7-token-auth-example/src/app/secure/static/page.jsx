import Link  from 'next/link'

export default function SecurePage__Static() {
  return (
    <>
      <h1 className="text-xl font-bold">Secure Static Page</h1>
      <p>If you're seeing this message, congratulations! Your token is working properly.</p>
      <p className="mt-4"><Link className="underline text-slate-400 hover:text-slate-800" href="/secure">Return to the Token Auth landing page.</Link></p>
    </>
  )
}