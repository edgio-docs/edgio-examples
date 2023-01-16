const { nextRoutes } = require('@edgio/next')
const { Router } = require('@edgio/core/router')
const { generate } = require('./randomStringGenerator')

let prerenderPages = []
let prerenderUrlCount = 25000 // Change to 100 if on FREE plan
for (var i = 0; i < prerenderUrlCount; i++) {
  prerenderPages.push(`/prerender/${generate(10)}`)
}

module.exports = new Router()
  .prerender(prerenderPages.map((page) => ({ path: page })))
  .match('/prerender/:path', ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24,
      },
      browser: false,
    })
  })
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
  })
  .use(nextRoutes)
