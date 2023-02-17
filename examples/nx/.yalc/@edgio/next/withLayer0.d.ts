declare const _default: (_nextConfig: any) => any;
/**
 * Creates a Next.js config suitable for deployment on Layer0.
 *
 * Example usage:
 *
 * ```js
 *  // next.config.js
 *
 *  import withLayer0 from '@layer0/next/withLayer0'
 *
 *  module.exports = withLayer0({
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
