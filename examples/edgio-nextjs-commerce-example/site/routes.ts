// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core/router'
import { nextRoutes } from '@edgio/next'

export default new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
  })
  .use(nextRoutes) // automatically adds routes for all files under /pages
