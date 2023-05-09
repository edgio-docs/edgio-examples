import '@/styles/globals.css'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D]">
      <Navbar />
      <Component key={router.asPath} {...pageProps} />
    </div>
  )
}

export default MyApp
