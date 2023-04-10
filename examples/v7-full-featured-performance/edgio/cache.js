export const API_CACHE_HANDLER = {
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
        source: '/edgio-api/:path*',
        syntax: 'path-to-regexp',
        destination: '/:path*',
      },
    ],
  },
}

export const IMAGE_CACHE_HANDLER = {
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
}

export const ASSET_CACHE_HANDLER = {
  headers: {
    remove_origin_response_headers: ['set-cookie', 'cache-control'],
    set_response_headers: {
      'x-sw-cache-control': 'max-age=86400',
    },
  },
  caching: {
    max_age: '31536000s',
    stale_while_revalidate: '86400s',
    service_worker_max_age: '86400s',
    bypass_client_cache: true,
  },
}

export const NEXT_CACHE_HANDLER = {
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
}

export const SAMPLEAPIS_CACHE_HANDLER = ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      // Cache responses even if they contain cache-control: private header
      // https://docs.edg.io/guides/caching#private
      // https://docs.edg.io/docs/api/core/interfaces/_router_cacheoptions_.edgecacheoptions.html#forceprivatecaching
      forcePrivateCaching: true,
      staleWhileRevalidateSeconds: 60 * 60 * 24,
    },
    browser: {
      // Don't save the response in the browser
      maxAgeSeconds: 0,
      // Save the response in the browser via Edgio service worker
      serviceWorkerSeconds: 60 * 60 * 24,
      forcePrivateCaching: true,
    },
  })
  proxy('sampleapis', {
    path: ':path*',
    transformResponse: (response) => {
      // TODO response.body is not a string
      // if (response.body) {
      //   response.body = response.body.toString().replace(/https:\/\/m.media-amazon.com\//g, '/edgio-opt?quality=80&img=https://m.media-amazon.com/')
      // }
    },
  })
}

export const IMDB_CACHE_HANDLER = ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      // Cache responses even if they contain cache-control: private header
      // https://docs.edg.io/guides/caching#private
      // https://docs.edg.io/docs/api/core/interfaces/_router_cacheoptions_.edgecacheoptions.html#forceprivatecaching
      forcePrivateCaching: true,
      staleWhileRevalidateSeconds: 60 * 60 * 24,
    },
    browser: {
      // Don't save the response in the browser
      maxAgeSeconds: 0,
      // Save the response in the browser via Edgio service worker
      serviceWorkerSeconds: 60 * 60 * 24,
      forcePrivateCaching: true,
    },
  })
  proxy('imdb', {
    path: ':path*',
    transformResponse: (response) => {
      // TODO response.body is not a string
      // if (response.body) {
      //   response.body = response.body.toString().replace('https://m.media-amazon.com/', '/edgio-opt?width=600&img=https://m.media-amazon.com/')
      // }
    },
  })
}
