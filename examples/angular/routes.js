// This file was automatically added by edgio deploy.
// You should commit this file to source control.

const { Router } = require('@edgio/core/router')
const { angularRoutes } = require('@edgio/angular')

const staticCacheConfig = {
  edge: {
    maxAgeSeconds: 60 * 60,
  },
}

module.exports = new Router()
  // Prevent search engines from indexing permalink URLs
  .noIndexPermalink()
  .match('/service-worker.js', ({ serveStatic }) => {
    serveStatic('sw/bundled-service-worker.js')
  })
  .match('/', ({ cache }) => {
    cache(staticCacheConfig)
  })
  .match('/about', ({ cache }) => {
    cache(staticCacheConfig)
  })
  .match('/commerce', ({ cache }) => {
    cache(staticCacheConfig)
  })
  .match('/commerce/:path', ({ cache }) => {
    cache(staticCacheConfig)
  })
  .match('/product/:path', ({ cache }) => {
    cache(staticCacheConfig)
  })
  .use(angularRoutes)
