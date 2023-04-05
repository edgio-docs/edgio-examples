export const API_CACHE_HANDLER = ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      // Cache responses even if they contain cache-control: private header
      // https://docs.edg.io/guides/caching#private
      // https://docs.edg.io/docs/api/core/interfaces/_router_cacheoptions_.edgecacheoptions.html#forceprivatecaching
      forcePrivateCaching: true,
    },
    browser: {
      serviceWorkerSeconds: 60 * 60 * 24,
    },
  })
  // TODO: check if it gives error when deployed also
  // the issue -> when the slash isnt there, the path is mapped to something like localhost:3000categories instead of localhost:3000/categories
  // it makes sense in terms of express.js, but it obviously worked before, so - dont know
  proxy('api', { path: '/:path*' })
}

export const IMAGE_CACHE_HANDLER = ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60,
      // Cache responses even if they contain cache-control: private header
      // https://docs.edg.io/guides/caching#private
      // https://docs.edg.io/docs/api/core/interfaces/_router_cacheoptions_.edgecacheoptions.html#forceprivatecaching
      forcePrivateCaching: true,
    },
    browser: {
      // Don't save the response in the browser
      maxAgeSeconds: 0,
      // Save the response in the browser via Edgio service worker
      serviceWorkerSeconds: 60 * 60 * 24,
    },
  })
  proxy('image', { path: '/' })
}

export const EDGE_CACHE_HANDLER = ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
    },
    browser: {
      serviceWorkerSeconds: 60 * 60 * 24,
    },
  })
}

export const STATIC_CACHE_CONFIG = {
  browser: {
    serviceWorkerSeconds: 60 * 60 * 24 * 365,
  },
  edge: {
    maxAgeSeconds: 60 * 60 * 24 * 365,
    forcePrivateCaching: true,
  },
}
