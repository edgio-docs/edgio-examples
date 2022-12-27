// This file was automatically added by edgio deploy.
// You should commit this file to source control.

import { Router } from '@edgio/core'
import { astroRoutes } from '@edgio/astro'

import { PAGE_CACHE_HANDLER, API_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

export default new Router()
  // Prevent search engines from indexing permalink URLs
  .noIndexPermalink()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('sw/bundled-service-worker.js')
  })
  .match('/', PAGE_CACHE_HANDLER)
  .match('/about', PAGE_CACHE_HANDLER)
  .match('/commerce', PAGE_CACHE_HANDLER)
  .match('/commerce/:path*', PAGE_CACHE_HANDLER)
  .match('/product/:path*', PAGE_CACHE_HANDLER)
  .match('/l0-api/:path*', API_CACHE_HANDLER)
  .match('/l0-opt', IMAGE_CACHE_HANDLER)
  .use(astroRoutes)
