/**
 * A Next.js plugin that emits a service worker suitable for prefetching
 * assets from Edgio. This plugin also applies the `withEdgio` plugin.
 *
 * Example usage:
 *
 * ```js
 *  // next.config.js
 *
 *  import { withServiceWorker } from '@edgio/next/sw'
 *
 *  module.exports = withServiceWorker({
 *    webpack(config, options) {
 *      // your custom webpack config here
 *    }
 *  })
 * ```
 */
export default function withServiceWorkerInternal(_nextConfig: any): any;
