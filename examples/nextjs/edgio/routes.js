import { Router } from '@edgio/core'
import getPrerenderRequests from './prerenderRequests'
import { nextRoutes, renderNextPage } from '@edgio/next'
import { isProductionBuild } from '@edgio/core/environment'
import { NEXT_CACHE_HANDLER, API_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

const router = new Router()

// Pre-render the static home page
// By pre-rendering, once the project is deployed
// the set of links are visited to warm the cache
// for future visits (expected to be the first view for real users)
// More on static prerendering: https://docs.edg.io/guides/static_prerendering
router.prerender(getPrerenderRequests)

// Serve the old Edgio predefined routes by the latest prefix
router.match('/__xdn__/:path*', ({ redirect }) => {
  redirect('/__edgio__/:path*', 301)
})

// API (Any backend) caching
router.match('/l0-api/:path*', API_CACHE_HANDLER)

// Image caching
router.match('/l0-opt', IMAGE_CACHE_HANDLER)

router.get('/service-worker.js', ({ serviceWorker }) => {
  return serviceWorker('.next/static/service-worker.js')
})

// Sync rewrite as placed in next.config.js
router.get('/commerce/:name', ({ renderWithApp }) => {
  renderWithApp()
})

// Only compiled with 0 build / 0 deploy
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
}

// Fallback in case any request is not served by any routes above will be handled by default routes
router.use(nextRoutes)

export default router
