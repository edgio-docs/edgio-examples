// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core/router'
import { nextRoutes } from '@edgio/next'

// Remove this line to suppress Next's default behavior of removing trailing slashes via a redirect.
// If trailingSlash: true is set in next.config.js, removing this line will remove the redirect that adds the trailing slash.
nextRoutes.setEnforceTrailingSlash(true)

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)
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
    headers: { set_request_headers: { '+x-edg-serverless-hint': '' } },
    origin: { set_origin: 'api' },
  })
  .match('/edgio-opt', {
    caching: { max_age: '86400s', stale_while_revalidate: '31536000s', bypass_client_cache: true },
    url: {
      url_rewrite: [
        {
          source: '/edgio-opt',
          syntax: 'path-to-regexp',
          destination: '/',
        },
      ],
    },
    headers: { set_request_headers: { '+x-edg-serverless-hint': '' } },
    origin: { set_origin: 'image' },
  })
