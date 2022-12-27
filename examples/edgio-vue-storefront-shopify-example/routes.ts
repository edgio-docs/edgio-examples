// This file was added by edgio init.
// You should commit this file to source control.

import { Router } from '@edgio/core/router'
import { CacheOptions } from '@edgio/core/router/CacheOptions'
import { nuxtRoutes, renderNuxtPage } from '@edgio/nuxt'

const HTML: CacheOptions = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24,
    staleWhileRevalidateSeconds: 60 * 60 * 24,
    forcePrivateCaching: true,
  },
  browser: false,
}

export default new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .use(nuxtRoutes)
  .fallback(renderNuxtPage)
