export const API_CACHE_HANDLER = ({ cache, proxy }) => {
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
  proxy('api', { path: ':path*' })
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

export const ONE_DAY_CACHE_HANDLER = ({ cache }) => {
  // Set the caching values
  cache({
    edge: {
      // Save the response(s) [whether stale or updated] in the edge POP for a year
      maxAgeSeconds: 60 * 60 * 24,
    },
  })
}
