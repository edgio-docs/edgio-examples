import { Router } from '@edgio/core'
import { isProductionBuild } from '@edgio/core/environment'

const router = new Router()

if (isProductionBuild()) {
  // include everything as static except the marko router
  router.static('dist', { glob: 'assets/*', ignore: 'index.mjs' })
}

// ensure that no responses get cached on Edgio's platform
// but let the server send the browser cache-control header
router.fallback(({ renderWithApp, cache }) => {
  cache({
    edge: false,
  })
  renderWithApp()
})

export default router
