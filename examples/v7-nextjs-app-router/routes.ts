// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core/router';
import { nextRoutes } from '@edgio/next';

export default new Router()
  .use(nextRoutes)

  // caching for all requests
  .match('/(.*)', {
    caching: {
      max_age: '86400s',
      stale_while_revalidate: '31536000s',
      bypass_client_cache: true,
      ignore_origin_no_cache: [200],
    },
  })
  .match('/edgio-api/:path*', {
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
  });
