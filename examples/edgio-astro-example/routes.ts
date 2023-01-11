// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core'
import { astroRoutes } from '@edgio/astro'
import { API_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

export default new Router()
  .match('/l0-api/:path*', API_CACHE_HANDLER)
  .match('/l0-opt', IMAGE_CACHE_HANDLER)
  .use(astroRoutes)
