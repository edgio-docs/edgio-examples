// This file was added by edgio init.
// You should commit this file to source control.

import { Router } from '@edgio/core/router'
import { API_CACHE_HANDLER, SSR_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './edgio/cache'

export default new Router()
  .match('/', SSR_CACHE_HANDLER)
  .match('/catgeory/:path*', SSR_CACHE_HANDLER)
  .match('/products/:path*', SSR_CACHE_HANDLER)
  .match('/api/images/:path*', IMAGE_CACHE_HANDLER)
  .match('/api/:path*', API_CACHE_HANDLER)
  // Send requests to static assets in the build output folder `dist`
  .static('public')

  // Send everything else to the App Shell
  .fallback(({ appShell }) => {
    appShell('public/index.html')
  })
