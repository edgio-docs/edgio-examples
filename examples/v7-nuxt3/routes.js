// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core/router'
import { nuxtRoutes } from '@edgio/nuxt-nitro'

export default new Router()
  .use(nuxtRoutes)
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
  .match('/edgio-image/:path*', {
    comment:
      'Matches all requests to /edgio-image/* including path and query params, ' +
      'rewrites the url to exclude /edgio-image and proxy it to the "api" origin where the image is hosted.' +
      'Then apply the image optimization feature to the response.',
    url: {
      url_rewrite: [
        {
          source: '\\/edgio-image\\/(.*)',
          destination: '/$1',
          syntax: 'regexp',
        },
      ],
    },
    origin: { set_origin: 'api' },
    response: { optimize_images: true },
  })
