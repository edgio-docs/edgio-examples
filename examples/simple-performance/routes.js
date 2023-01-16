// This file was added by edgio init.
// You should commit this file to source control.

import { Router } from '@edgio/core/router'

const ONE_HOUR = 60 * 60
const ONE_DAY = 24 * ONE_HOUR

const CACHE_ASSETS = {
  edge: {
    maxAgeSeconds: ONE_DAY,
    forcePrivateCaching: true,
  },
  browser: {
    maxAgeSeconds: 0,
    serviceWorkerSeconds: ONE_DAY,
  },
}

export default new Router()


  // caching stylesheets and scripts
  .match(
    '/:path*/:file.:ext(js|mjs|css)',
    ({ cache, removeUpstreamResponseHeader, proxy, setResponseHeader }) => {
      setResponseHeader('cache-control', 'public, max-age=86400')
      removeUpstreamResponseHeader('set-cookie')
      cache(CACHE_ASSETS)
      proxy('origin')
    }
  )

  // caching assets
  .match(
    '/:path*/:file.:ext(png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)',
    ({ cache, removeUpstreamResponseHeader, proxy, setResponseHeader }) => {
      setResponseHeader('cache-control', 'public, max-age=86400')
      removeUpstreamResponseHeader('set-cookie')
      cache(CACHE_ASSETS)
      proxy('origin')
    }
  )

  // Here is an example where we cache api/* at the edge but prevent caching in the browser
  // .match('/api/:path*', ({ proxy, cache }) => {
  //   cache({
  //     edge: {
  //       maxAgeSeconds: ONE_DAY,
  //       staleWhileRevalidateSeconds: ONE_HOUR,
  //     },
  //     browser: {
  //       maxAgeSeconds: 0,
  //       serviceWorkerSeconds: ONE_DAY,
  //     },
  //   })
  //   proxy('origin')
  // })

  

  // send any unmatched request to origin
  .fallback(({ proxy }) => proxy('origin'))
