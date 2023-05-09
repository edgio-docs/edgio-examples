// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core/router'
import { nextRoutes } from '@edgio/next'

// Remove this line to suppress Next's default behavior of removing trailing slashes via a redirect.
// If trailingSlash: true is set in next.config.js, removing this line will remove the redirect that adds the trailing slash.
nextRoutes.setEnforceTrailingSlash(true)

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)
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
