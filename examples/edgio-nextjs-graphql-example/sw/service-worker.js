import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { Prefetcher } from '@edgio/prefetch/sw'
import DeepFetchPlugin from '@edgio/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      // query the PLP API response for images to prefetch
      // prefetch logic is handled in _app.js
      {
        jsonQuery: 'pageProps.products.picture',
        maxMatches: 10,
        as: 'image',
      },
    ]),
  ],
}).route()
