declare const _default: (_nextConfig: any) => any;
/**
 * Creates a Next.js config suitable for deployment on the Moovweb XDN.
 *
 * Example usage:
 *
 * ```js
 *  // next.config.js
 *
 *  import withXDN from '@xdn/next/withXDN'
 *
 *  module.exports = withXDN({
 *    webpack(config, options) {
 *      // your custom webpack config here
 *    }
 *  })
 * ```
 *
 * @param config A next.js config
 * @return A next.js config
 */
export = _default;
