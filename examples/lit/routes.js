import { Router } from '@edgio/core/router'
import { isProductionBuild } from '@edgio/core/environment'

const ONE_DAY_CACHE_HANDLER = ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 24 * 60 * 60,
    },
  })
}

const router = new Router()

// Serve all files from assets folder as static files
router.static('assets')

if (isProductionBuild()) {
  router.match('/', ONE_DAY_CACHE_HANDLER)
  router.match('/about', ONE_DAY_CACHE_HANDLER)
  // Serve all files in build directory as static files
  router.static('build')
  // Fallback Page
  router.fallback(({ serveStatic }) => {
    serveStatic('build/index.html')
  })
} else {
  router.fallback(({ renderWithApp }) => {
    renderWithApp()
  })
}

export default router
