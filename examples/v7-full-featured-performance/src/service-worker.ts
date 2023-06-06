import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@edgio/prefetch/sw'
import DeepFetchPlugin from '@edgio/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        as: 'style',
        maxMatches: 5,
        attribute: 'href',
        selector: 'link[type="text/css"]',
        callback: ({ $el }) => {
          const href = $el.attr('href')
          if (href) prefetch(href)
        },
      },
    ]),
  ],
}).route()
