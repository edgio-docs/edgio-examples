import styles from './styles/app.css'
import Navbar from './components/Navbar'

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

export const meta = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => [{ rel: 'stylesheet', href: styles }]

const App = () => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="font-display flex min-h-screen flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D]">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
