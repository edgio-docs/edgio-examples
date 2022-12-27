// routes.ts
import { Router } from '@layer0/core/router'
import { STATIC_ASSET_CACHE } from './cache'

export default new Router()
  .prerender([{ path: '/' }])

  // client-rendered appshell
  .get('/', ({ serveStatic, cache }) => {
    cache(STATIC_ASSET_CACHE)
    serveStatic('index.html')
  })

  // css/js resources
  .get('/js/:path*', ({ serveStatic, cache }) => {
    cache(STATIC_ASSET_CACHE)
    serveStatic('js/:path*')
  })
  .get('/css/:path*', ({ serveStatic, cache }) => {
    cache(STATIC_ASSET_CACHE)
    serveStatic('css/:path*')
  })

  // all other routes not matched above
  .fallback(({ serveStatic, cache }) => {
    cache(STATIC_ASSET_CACHE)
    serveStatic('index.html')
  })
