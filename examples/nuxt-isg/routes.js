const { Router } = require('@edgio/core/router')
const { nuxtRoutes } = require('@edgio/nuxt')

module.exports = new Router()
  .use(nuxtRoutes)
  .get('/', ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    })
  })
  .get('/blogs/:username', ({ serveStatic, cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
        staleWhileRevalidateSeconds: 1,
      },
      browser: false,
    })
  })
  .get('/api/blogs/:username.json', ({ serveStatic, cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24,
      },
    })
  })
