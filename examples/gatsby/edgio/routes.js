const { Router } = require('@edgio/core/router')
const { gatsbyRoutes } = require('@edgio/gatsby')
const { isProductionBuild } = require('@edgio/core/environment')
const { default: getPathsToPrerender } = require('./prerenderRequests')
const { API_CACHE_HANDLER, IMAGE_CACHE_HANDLER, ONE_DAY_CACHE_HANDLER } = require('./cache')

const router = new Router()

// Regex to catch multiple hostnames
// Any deployment will have a L0 permalink
// Don't allow Google bot to crawl it, read more on:
// https://docs.edg.io/guides/cookbook#blocking-search-engine-crawlers
router.noIndexPermalink()

// Pre-render the static home page
// By pre-rendering, once the project is deployed
// the set of links are visited to warm the cache
// for future visits (expected to be the first view for real users)
// More on static prerendering: https://docs.edg.io/guides/static_prerendering
router.prerender(getPathsToPrerender)

// API (Any backend) caching
router.match('/l0-api/:path*', API_CACHE_HANDLER)

// Image caching
router.match('/l0-opt', IMAGE_CACHE_HANDLER)

router.get('/service-worker.js', ({ serviceWorker }) => {
  serviceWorker('public/service-worker.js')
})

// Only compiled with 0 build / 0 deploy
if (isProductionBuild()) {
  // Cache but not in 0 dev mode
  router.match('/', ONE_DAY_CACHE_HANDLER)
  router.match('/about', ONE_DAY_CACHE_HANDLER)
  router.match('/commerce', ONE_DAY_CACHE_HANDLER)
  router.match('/product/:name', ONE_DAY_CACHE_HANDLER)
  router.match('/commerce/:name', ONE_DAY_CACHE_HANDLER)
}

router.use(gatsbyRoutes)

export default router
