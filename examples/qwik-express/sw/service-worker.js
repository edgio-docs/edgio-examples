import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@edgio/prefetch/sw'
import DeepFetchPlugin from '@edgio/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: 'script',
        maxMatches: 20,
        attribute: 'src',
        as: 'script',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="stylesheet"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="preload"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: 'img',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: 'source',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: 'video',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
    ]),
  ],
})
  .route()
  .cache(/^https:\/\/(.*?)\.*\/.*/)

function deepFetchAssets({ $el, el, $ }) {
  let attributesToLookFor = ['href', 'src', 'url']
  attributesToLookFor.forEach((i) => {
    let urlTemplate = $(el).attr(i)
    if (urlTemplate) {
      prefetch(urlTemplate)
    }
  })
}
