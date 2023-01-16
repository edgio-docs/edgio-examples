// This file was automatically added by edgio deploy.
// You should commit this file to source control.
const { Router } = require('@edgio/core/router')
const { nextRoutes } = require('@edgio/next')

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
  })
  .use(nextRoutes) // automatically adds routes for all files under /pages
