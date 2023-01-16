const { Router } = require("@edgio/core/router");
const { fastbootRoutes } = require('@edgio/fastboot')

module.exports = new Router()
  .get('/', ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
        staleWhileRevalidateSeconds: 60 * 60 * 24
      },
      browser: false
    })
  })
  .use(fastbootRoutes);
