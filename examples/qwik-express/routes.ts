const ONE_YEAR = 365 * 24 * 60 * 60

import { Router } from '@edgio/core'
import { isProductionBuild } from '@edgio/core/environment'

const router = new Router()

router.noIndexPermalink()

if (isProductionBuild()) {
  router.static('dist')
}

const pages = ['/', '/docs', '/about-us']

pages.forEach((i) => {
  router.match(i, ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_YEAR,
        // Prevent cache misses due to cache-control: private
        forcePrivateCaching: true,
      },
    })
  })
})

router.fallback(({ renderWithApp }) => renderWithApp())

export default router
