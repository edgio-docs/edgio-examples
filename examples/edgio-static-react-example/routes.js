// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core'
import { reactCRARoutes } from '@edgio/react-cra'
import { isProductionBuild } from '@edgio/core/environment'
import { API_CACHE_HANDLER, EDGE_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

const router = new Router()

// Prevent search engines from indexing permalink URLs
router.noIndexPermalink()

// API (Any backend) caching
router.match('/l0-api/:path*', API_CACHE_HANDLER)

// Image caching
router.match('/l0-opt', IMAGE_CACHE_HANDLER)

if (isProductionBuild()) {
  router.match('/', EDGE_CACHE_HANDLER)
  router.match('/about', EDGE_CACHE_HANDLER)
  router.match('/commerce', EDGE_CACHE_HANDLER)
  router.match('/product/:name', EDGE_CACHE_HANDLER)
  router.match('/commerce/:name', EDGE_CACHE_HANDLER)
}

router.use(reactCRARoutes)

export default router
