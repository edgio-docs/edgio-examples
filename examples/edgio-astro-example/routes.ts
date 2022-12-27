// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core'
import { astroRoutes } from '@edgio/astro'
import { API_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

export default new Router()
  // Prevent search engines from indexing permalink URLs
  .noIndexPermalink()
  .match('/__xdn__/:path*', ({ redirect }) => {
    redirect('/__layer0__/:path*', 301)
  })
  .match('/__layer0__/:path*', ({ redirect }) => {
    redirect('/__edgio__/:path*', 301)
  })
  .match('/l0-api/:path*', API_CACHE_HANDLER)
  .match('/l0-opt', IMAGE_CACHE_HANDLER)
  .use(astroRoutes)
