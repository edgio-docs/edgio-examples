import { nuxtRoutes } from '@edgio/nuxt'
import { Router } from '@edgio/core/router'

export default new Router()
  .use(nuxtRoutes)
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .match('/edgio-api/:path*', {
    caching: { max_age: '86400s', stale_while_revalidate: '31536000s', bypass_client_cache: true },
    url: {
      url_rewrite: [
        {
          source: '/edgio-api/:path*',
          syntax: 'path-to-regexp',
          destination: '/:path*',
        },
      ],
    },
    origin: { set_origin: 'api' },
  })
  .match('/edgio-opt', {
    caching: { max_age: '86400s', stale_while_revalidate: '31536000s', bypass_client_cache: true },
    url: {
      url_rewrite: [
        {
          source: '/edgio-opt:optionalSlash(\\/?)?:optionalQuery(\\?.*)?',
          syntax: 'path-to-regexp',
          destination: '/:optionalSlash:optionalQuery',
        },
      ],
    },
    origin: { set_origin: 'image' },
  })
