// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from '@edgio/core/router'
import { sapperRoutes } from '@edgio/sapper'
import getPrerenderRequests from './edgio/getPrerenderRequests'
import { API_CACHE_HANDLER, SSR_CACHE_HANDLER } from './edgio/cache'

export default new Router()
  .prerender(getPrerenderRequests)
  .match('/api/:build_id/:path*', API_CACHE_HANDLER)
  .match('/', SSR_CACHE_HANDLER)
  .match('/category/:name', SSR_CACHE_HANDLER)
  .match('/product/:name', SSR_CACHE_HANDLER)
  .use(sapperRoutes) // automatically adds routes for all files under /src/routes
