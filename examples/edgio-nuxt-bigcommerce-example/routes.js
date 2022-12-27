// This file was added by edgio init.
// You should commit this file to source control.

const { Router } = require('@edgio/core/router');
const { nuxtRoutes } = require('@edgio/nuxt');

const CACHE_TTL_1H = 3600;
const CACHE_TTL_12H = CACHE_TTL_1H * 12;

const CACHE_OPTIONS = {
  browser: {
    maxAgeSeconds: CACHE_TTL_12H,
    serviceWorkerSeconds: CACHE_TTL_12H
  },
  edge: {
    maxAgeSeconds: CACHE_TTL_12H,
    staleWhileRevalidateSeconds: CACHE_TTL_12H,
    forcePrivateCaching: true
  }
};

const apiHandler = ({ renderWithApp }) => {
  renderWithApp();
};

const apiHandlerWithCache = ({ renderWithApp, cache }) => {
  cache(CACHE_OPTIONS);
  renderWithApp();
};

const pageCacheHandler = ({ cache }) => {
  cache(CACHE_OPTIONS);
};

const router = new Router();

// edgio service-worker
router.match('/service-worker.js', ({ serviceWorker }) => {
  serviceWorker('.nuxt/dist/client/service-worker.js');
});

// cache HTML pages
router.match('/', pageCacheHandler);
router.match('/cart', pageCacheHandler);
router.match('/products', pageCacheHandler);
router.match('/products/:path*', pageCacheHandler);
router.match('/logic', pageCacheHandler);

// api cache-able routes
router.match('/getProductsByCategory', apiHandlerWithCache);
router.match('/getProductBySlug', apiHandlerWithCache);
router.match('/getCategories', apiHandlerWithCache);

// nuxt
router.use(nuxtRoutes);

// other api routes
router.fallback(apiHandler);

export default router;
