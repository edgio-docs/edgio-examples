import { Router } from '@edgio/core'
import { nuxtRoutes } from '@edgio/nuxt-nitro'

export default new Router()
  .use(nuxtRoutes)
  .match('/l0-api/:path*', ({ cache, proxy, removeUpstreamResponseHeader, removeRequestHeader }) => {
    removeRequestHeader('+x-edg-serverless-hint')
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24,
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
      },
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: 60 * 60 * 24,
      },
    })
    proxy('api', { path: '/:path*' })
  })
  .match('/l0-opt', ({ cache, proxy, removeUpstreamResponseHeader, removeRequestHeader }) => {
    removeRequestHeader('+x-edg-serverless-hint')
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24,
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
      },
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: 60 * 60 * 24,
      },
    })
    proxy('image', { path: '/' })
  })
