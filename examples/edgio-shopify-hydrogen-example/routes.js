const ONE_HOUR = 60 * 60;
const ONE_DAY = 24 * ONE_HOUR;

const {Router} = require('@edgio/core/router');

module.exports = new Router()
  .match('/assets/:path*', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
        forcePrivateCaching: true,
      },
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: ONE_DAY,
      },
    });
  })
  .match('/', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
      },
      browser: false,
    });
  })
  .match('/collections', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
      },
      browser: false,
    });
  })
  .match('/products', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
      },
      browser: false,
    });
  })
  .match('/journal', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
      },
      browser: false,
    });
  })
  .match('/collections/:path*', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
      },
      browser: false,
    });
  })
  .match('/products/:path*', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
        forcePrivateCaching: true,
      },
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: ONE_DAY,
      },
    });
  })
  .match('/journal/:path*', ({cache}) => {
    cache({
      edge: {
        maxAgeSeconds: ONE_DAY,
        forcePrivateCaching: true,
      },
      browser: {
        maxAgeSeconds: 0,
        serviceWorkerSeconds: ONE_DAY,
      },
    });
  })
  .fallback(({renderWithApp}) => renderWithApp());
