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

export const SAMPLEAPIS_CACHE_HANDLER = {
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
        source: '/edgio-sampleapis/:path*:optionalSlash(\\/?)?:optionalQuery(\\?.*)?',
        syntax: 'path-to-regexp',
        destination: '/:path*:optionalSlash:optionalQuery',
      },
    ],
  },
}

export const IMDB_CACHE_HANDLER = {
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
}
