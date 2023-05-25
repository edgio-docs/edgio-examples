import { Router } from '@edgio/core'
// import getPrerenderRequests from './prerenderRequests'
import { nextRoutes } from '@edgio/next'
import { isProductionBuild } from '@edgio/core/environment'

const router = new Router().use(nextRoutes)

router.match('/edgio-opt', {
  caching: {
    max_age: '3600s',
    stale_while_revalidate: '86400s',
    ignore_origin_no_cache: [200],
    service_worker_max_age: '86400s',
    bypass_client_cache: true,
  },
  headers: {
    set_response_headers: {
      'x-sw-cache-control': 'max-age=86400',
    },
  },
  origin: {
    set_origin: 'image',
  },
  url: {
    url_rewrite: [
      {
        source: '/edgio-opt:optionalSlash(\\/?)?:optionalQuery(\\?.*)?',
        syntax: 'path-to-regexp',
        destination: '/:optionalSlash:optionalQuery',
      },
    ],
  },
})

// API
router.match('/edgio-api/:path*', {
  caching: {
    max_age: '3600s',
    stale_while_revalidate: '86400s',
    ignore_origin_no_cache: [200],
    service_worker_max_age: '86400s',
    bypass_client_cache: true,
  },
  headers: {
    set_response_headers: {
      'x-sw-cache-control': 'max-age=86400',
    },
  },
  origin: {
    set_origin: 'api',
  },
  url: {
    url_rewrite: [
      {
        source: '/edgio-api/(.*)',
        syntax: 'regexp',
        destination: '/$1',
      },
    ],
  },
})

//Image caching

// Sample Api
router.match('/edgio-sampleapis/:path*', {
  caching: {
    max_age: '86400s',
    stale_while_revalidate: '86400s',
    ignore_origin_no_cache: [200],
    service_worker_max_age: '86400s',
    bypass_client_cache: true,
  },
  headers: {
    set_response_headers: {
      'x-sw-cache-control': 'max-age=86400',
    },
  },
  origin: {
    set_origin: 'sampleapis',
  },
  url: {
    url_rewrite: [
      {
        source: '/edgio-sampleapis/(.*)',
        syntax: 'regexp',
        destination: '/$1',
      },
    ],
  },
})

// imdb
router.match('/edgio-imdb/:path*', {
  caching: {
    max_age: '86400s',
    stale_while_revalidate: '86400s',
    ignore_origin_no_cache: [200],
    service_worker_max_age: '86400s',
    bypass_client_cache: true,
  },
  headers: {
    set_response_headers: {
      'x-sw-cache-control': 'max-age=86400',
    },
  },
  origin: {
    set_origin: 'imdb',
  },
  url: {
    url_rewrite: [
      {
        source: '/edgio-imdb/:path*:optionalSlash(\\/?)?:optionalQuery(\\?.*)?',
        syntax: 'path-to-regexp',
        destination: '/:path*:optionalSlash:optionalQuery',
      },
    ],
  },
})

// Only compiled with `edgio build` / `edgio deploy`
if (isProductionBuild()) {
  router.match(['/', '/about', '/commerce', '/product/:name', '/commerce/:name', '/movies', '/movie/:name', '/_next/data/:path*'], {
    headers: {
      remove_origin_response_headers: ['cache-control'],
      set_response_headers: {
        'x-sw-cache-control': 'max-age=86400',
      },
    },
    caching: {
      max_age: '31536000s',
      stale_while_revalidate: '86400s',
      ignore_origin_no_cache: [200],
      service_worker_max_age: '86400s',
      bypass_client_cache: true,
    },
  })
}

export default router
