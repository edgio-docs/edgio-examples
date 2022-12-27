import { Router } from '@edgio/core/router'

const router = new Router()

router.static('.vercel/output/static')

router.fallback(({ renderWithApp, removeUpstreamResponseHeader, cache }) => {
  removeUpstreamResponseHeader('cache-control')
  cache({
    browser: false,
  })
  renderWithApp()
})

export default router
