const { Router } = require('@edgio/core/router')
const { nuxtRoutes } = require('@edgio/nuxt')

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .get('/', ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    })
  })
  .get('/blogs/:username', ({ serveStatic, cache, renderWithApp }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
        staleWhileRevalidateSeconds: 1,
      },
      browser: false,
    })
    serveStatic('dist/blogs/:username.html', {
      onNotFound: () => renderWithApp(),
    })
  })
  .get('/api/blogs/:username.json', ({ serveStatic, cache, renderWithApp }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24,
      },
    })
    serveStatic('dist/blogs/:username.json', {
      onNotFound: () => renderWithApp(),
    })
  })
  .use(nuxtRoutes)
  .fallback(({ redirect }) => {
    return redirect('/error')
  })
