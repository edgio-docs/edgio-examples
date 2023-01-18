// This file was automatically added by edgio deploy.
// You should commit this file to source control.

import { Router } from '@edgio/core/router';
import { angularRoutes } from '@edgio/angular';

const PAGE_TTL = 60 * 60 * 24;
const FAR_FUTURE_TTL = 60 * 60 * 24 * 365 * 10;

const CACHE_API = {
  browser: {
    maxAgeSeconds: 0,
    serviceWorkerSeconds: PAGE_TTL,
  },
  edge: {
    maxAgeSeconds: PAGE_TTL,
    staleWhileRevalidateSeconds: PAGE_TTL,
    forcePrivateCaching: true,
  },
};

const CACHE_ASSETS = {
  browser: {
    maxAgeSeconds: PAGE_TTL,
  },
  edge: {
    maxAgeSeconds: FAR_FUTURE_TTL,
    staleWhileRevalidateSeconds: PAGE_TTL,
    forcePrivateCaching: true,
  },
};

const CACHE_SSR_PAGE = {
  prefetchUpstreamRequests: true,
  edge: {
    maxAgeSeconds: PAGE_TTL * 365,
    staleWhileRevalidateSeconds: PAGE_TTL * 365,
    forcePrivateCaching: true,
  },
};

const ssrPageCacheHandler = ({ cache }) => {
  cache(CACHE_SSR_PAGE);
};

export default new Router()
  .match(
    '/occ/v2/electronics-spa/users/:user/:path*',
    ({ proxy, removeRequestHeader, compute }) => {
      compute(async () => {
        removeRequestHeader('origin');
        await proxy('commerce');
      });
    }
  )
  .match('/occ/v2/:path*', ({ cache, proxy, removeRequestHeader, compute }) => {
    compute(async () => {
      removeRequestHeader('origin');

      await proxy('commerce');
    });

    cache(CACHE_API);
  })
  .match('/medias/:path*', ({ cache, proxy, removeRequestHeader, compute }) => {
    compute(async () => {
      removeRequestHeader('origin');
      await proxy('commerce');
    });
    cache(CACHE_ASSETS);
  })
  .post('/authorizationserver/oauth/:path*', ({ proxy, compute }) => {
    compute(async () => {
      await proxy('commerce');
    });
  })

  // Main app pages:
  .get('/', ({ redirect }) => redirect('/electronics-spa/'))
  .get('/electronics-spa', ssrPageCacheHandler)
  .get('/electronics-spa/open-Catalogue/:path*', ssrPageCacheHandler)
  .get('/electronics-spa/product/:path*', ssrPageCacheHandler)
  .get('/electronics-spa/Brands/:path*', ssrPageCacheHandler)
  .use(angularRoutes);
