declare const _default: (_nextConfig: any) => any;
/**
 * Creates a Next.js config suitable for deployment on Edgio.
 *
 * Example usage:
 *
 * ```js
 *  // next.config.js
 *
 *  import withEdgio from '@edgio/next/withEdgio'
 *
 *  module.exports = withEdgio({
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
