import { Router } from '@edgio/core'
import getPrerenderRequests from './prerenderRequests'
import { nextRoutes } from '@edgio/next'
import { isProductionBuild } from '@edgio/core/environment'
import { IMDB_CACHE_HANDLER, SAMPLEAPIS_CACHE_HANDLER, NEXT_CACHE_HANDLER, API_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

const router = new Router()

router.use(nextRoutes)

// API (Any backend) caching
router.match('/edgio-api/:path*', API_CACHE_HANDLER)

//Image caching
router.match('/edgio-opt', IMAGE_CACHE_HANDLER)

// Sample Api
router.match('/edgio-sampleapis/:path*', SAMPLEAPIS_CACHE_HANDLER)

// imdb
router.match('/edgio-imdb/:path*', IMDB_CACHE_HANDLER)

// Sync rewrite as placed in next.config.js
//router.get('/commerce/:name', ({ renderWithApp }) => renderWithApp())

// Only compiled with `edgio build` / `edgio deploy`
if (isProductionBuild()) {
  // The data in Next.js comes through _next/data/project-build-id route.
  // For the route /product/product-slug, cache this SSR route's data
  // it on the edge so that can be prefetched

  router.match('/_next/data/:path*', NEXT_CACHE_HANDLER)

  // Cache but not in 0 dev mode
  router.match('/', NEXT_CACHE_HANDLER)
  router.match('/about', NEXT_CACHE_HANDLER)
  router.match('/commerce', NEXT_CACHE_HANDLER)
  router.match('/product/:name', NEXT_CACHE_HANDLER)
  router.match('/commerce/:name', NEXT_CACHE_HANDLER)
  router.match('/movies', NEXT_CACHE_HANDLER)
  router.match('/movie/:name', NEXT_CACHE_HANDLER)
}


export default router
