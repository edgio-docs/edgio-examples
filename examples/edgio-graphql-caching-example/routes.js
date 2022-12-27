const { nextRoutes } = require('@edgio/next')
const { Router } = require('@edgio/core/router')

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
  })
  .graphqlOperation('GetMissions', ({ proxy, cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60,
        staleWhileRevalidateSeconds: 60 * 60 * 24, // this way stale items can still be prefetched
      },
    })
    proxy('graphql') // forward posts requests to apollo unaltered
  })
  .graphqlOperation('GetRockets', ({ proxy }) => {
    proxy('graphql') // forward posts requests to apollo unaltered
  })
  .use(nextRoutes) // automatically adds routes for all files under /pages
