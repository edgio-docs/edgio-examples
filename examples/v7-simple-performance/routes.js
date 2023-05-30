// This file was added by edgio init.
// You should commit this file to source control.

import { Router, edgioRoutes } from '@edgio/core/router';

export default new Router()
  .use(edgioRoutes)
  .match(':path', {
    origin: {
      set_origin: 'origin',
    },
  })

  // caching stylesheets and scripts
  .match('/:path*/:file.:ext(js|mjs|css)', {
    headers: {
      set_response_headers: {
        'cache-control': 'public, max-age=86400',
      },
      remove_origin_response_headers: ['set-cookie'],
    },
    caching: {
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
    },
    origin: {
      set_origin: 'origin',
    },
  })

  // caching assets
  .match('/:path*/:file.:ext(png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)', {
    headers: {
      set_response_headers: {
        'cache-control': 'public, max-age=86400',
      },
      remove_origin_response_headers: ['set-cookie'],
    },
    caching: {
      ignore_origin_no_cache: [200],
      bypass_client_cache: true,
    },
    origin: {
      set_origin: 'origin',
    },
  });
