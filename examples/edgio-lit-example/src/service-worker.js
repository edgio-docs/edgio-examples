import { Prefetcher } from '../node_modules/@edgio/prefetch/sw/index.js'
import { precacheAndRoute } from '../node_modules/workbox-precaching/index.js'
import { skipWaiting, clientsClaim } from '../node_modules/workbox-core/index.js'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher().route()
