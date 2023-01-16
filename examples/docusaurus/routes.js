import { Router } from '@edgio/core/router'
import { isProductionBuild } from '@edgio/core/environment'

const router = new Router()

if (isProductionBuild()) {
  router.static('build')
  router.fallback(({ serveStatic }) => {
    serveStatic('build/index.html')
  })
} else {
  router.fallback(({ renderWithApp }) => {
    renderWithApp()
  })
}

module.exports = router
