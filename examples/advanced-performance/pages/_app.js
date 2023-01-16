import '@/styles/globals.css'
import { useEffect } from 'react'
import EdgioRUM from '@/edgio/rum'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import installDevtools from '@edgio/devtools/install'

// Include the RUM Analytics in the production build only
if (process.env.NODE_ENV === 'production') {
  EdgioRUM('a8413e5d-d2f3-4d59-9ffe-562067e2173d')
}

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    // Enable devtools manually, instead of relying on defaults by Edgio
    installDevtools()
  }, [])
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D]">
      <Navbar />
      <Component key={router.asPath} {...pageProps} />
    </div>
  )
}

export default MyApp
