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
        selector: 'link[rel="stylesheet"]',
        callback: ({ $el }) => {
          const href = $el.attr('href')
          if (href) prefetch(href)
        },
      },
      {
        as: 'image',
        maxMatches: 5,
        attribute: 'src',
        selector: 'img',
        callback: ({ $el }) => {
          const src = $el.attr('src')
          if (src) prefetch(src)
        },
      },
    ]),
  ],
}).route()
