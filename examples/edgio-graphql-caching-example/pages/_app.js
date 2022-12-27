import '@/styles/globals.css'
import { useEffect } from 'react'
import install from '@edgio/prefetch/window/install'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

function MyApp({ Component, pageProps }) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: '/graphql',
  })
  useEffect(() => install(), [])
  return (
    <div className="bg-white text-black font-display flex flex-col items-center">
      <ApolloProvider client={client}>
        <div className="py-10 w-full max-w-[90vw] lg:max-w-[75vw] sm:px-10 flex flex-col">
          <Component {...pageProps} />
        </div>
      </ApolloProvider>
    </div>
  )
}

export default MyApp
