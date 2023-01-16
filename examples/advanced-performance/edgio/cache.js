import { CustomCacheKey } from '@edgio/core/router'
export const API_CACHE_HANDLER = ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60,
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
  proxy('image', { path: '/' })
}

export const ASSET_CACHE_HANDLER = ({ removeUpstreamResponseHeader, cache }) => {
  // Remove the cache-control header coming in from the Next.js app,
  // and remove the set-cookie header coming in from the Next.js app,
  // this is to ensure that the response is cacheable
  removeUpstreamResponseHeader('set-cookie')
  removeUpstreamResponseHeader('cache-control')
  // Set the caching values
  cache({
    edge: {
      // Save the response(s) [whether stale or updated] in the edge POP for a year
      maxAgeSeconds: 60 * 60 * 24 * 365,
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
}

export const NEXT_CACHE_HANDLER = ({ removeUpstreamResponseHeader, cache }) => {
  // Remove the cache-control header coming in from the Next.js app,
  // this is to ensure that the response is cacheable
  removeUpstreamResponseHeader('cache-control')
  // Set the caching values
  cache({
    //CacheKey Normalization
    key: new CustomCacheKey().excludeAllQueryParametersExcept('category'),
    edge: {
      // Save the response(s) [whether stale or updated] in the edge POP for a year
      maxAgeSeconds: 60 * 60 * 24 * 365,
      // Keep revalidating data per day, i.e. looking for content changes from the Next.js app
      // and update the response in edge
      // More on: https://web.dev/stale-while-revalidate
      // and https://docs.edg.io/guides/caching#achieving-100-cache-hit-rates
      staleWhileRevalidateSeconds: 60 * 60 * 24,
      forcePrivateCaching: true,
    },
    browser: {
      // Don't save the response in the browser
      maxAgeSeconds: 0,
      // Save the response in the browser via Edgio service worker
      serviceWorkerSeconds: 60 * 60 * 24,
    },
  })
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
      if (response.body) {
        response.body = response.body
          .toString()
          .replace(
            /https:\/\/m.media-amazon.com\//g,
            '/l0-opt?quality=80&img=https://m.media-amazon.com/'
          )
      }
    }
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
      if (response.body) {
        response.body = response.body
          .toString()
          .replace(
            'https://m.media-amazon.com/',
            '/l0-opt?width=600&img=https://m.media-amazon.com/'
          )
      }
    }
  })


}

