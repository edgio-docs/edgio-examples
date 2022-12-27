const { Router } = require('@edgio/core/router')
const { razzleRoutes } = require('@edgio/razzle')
const { API_CACHE_HANDLER } = require('./edgio/cache')

module.exports = new Router()
  .match('/api/:path*', API_CACHE_HANDLER)
  .match('/images/:path*', API_CACHE_HANDLER)
  .use(razzleRoutes)
