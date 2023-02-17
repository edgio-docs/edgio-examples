import { Router } from '@edgio/core/router'
import { isProductionBuild } from '@edgio/core/environment'
import { API_CACHE_HANDLER, EDGE_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

const router = new Router()

// Regex to catch multiple hostnames
// Any deployment will have a L0 permalink
// Don't allow Google bot to crawl it, read more on:
// https://docs.edgio.co/guides/cookbook#blocking-search-engine-crawlers
router.noIndexPermalink()

// Serve the old Edgio predefined routes by the latest prefix
router.match('/__xdn__/:path*', ({ redirect }) => {
  redirect('/__edgio__/:path*', 301)
})

// API (Any backend) caching
router.match('/l0-api/:path*', API_CACHE_HANDLER)

// Image caching
router.match('/l0-opt', IMAGE_CACHE_HANDLER)

router.get('/service-worker.js', ({ serviceWorker }) => {
  return serviceWorker('public/service-worker.js')
})

// Only compiled with 0 build / 0 deploy
if (isProductionBuild()) {
  // Cache but not in 0 dev mode
  router.match('/', EDGE_CACHE_HANDLER)
  router.match('/about', EDGE_CACHE_HANDLER)
  router.match('/commerce', EDGE_CACHE_HANDLER)
  router.match('/product/:name', EDGE_CACHE_HANDLER)
  router.match('/commerce/:name', EDGE_CACHE_HANDLER)
  // Serve all files mapped to public directory
  router.static('public')
  // Any not found route shall serve the fallback
  router.fallback(({ serveStatic }) => {
    serveStatic('public/index.html')
  })
} else {
  router.get('/app.css', ({ serveStatic }) => {
    serveStatic('public/app.css')
  })
  router.fallback(({ renderWithApp }) => {
    renderWithApp()
  })
}

export default router
