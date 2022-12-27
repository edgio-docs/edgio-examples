// This file was added by layer0 init.
// You should commit this file to source control.

import { Router } from '@layer0/core/router'

export default new Router()
  .match('/robots.txt', ({ serveStatic }) => {
    serveStatic('dist/robots.txt')
  })
  .match('/assets/:path*', ({ cache, serveStatic }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 60 * 365,
        forcePrivateCaching: true,
      },
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: 60 * 60 * 24,
      },
    })
    serveStatic('dist/assets/:path*')
  })
  .fallback(({ appShell }) => {
    appShell('dist/index.html')
  })
