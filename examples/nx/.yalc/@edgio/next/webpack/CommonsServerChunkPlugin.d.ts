/**
 * This plugin injects the modules from a commons chunk into each module in pages during
 * the server build. This is needed to keep serverless builds small enough to fit in lambda.
 *
 * Example usage:
 *
 * ```js
 *  if (options.isServer) {
 *    config.output.chunkFilename = '[name].js'
 *    config.plugins.push(new CommonsServerChunkPlugin('commons'))
 *    config.optimization.splitChunks = {
 *      cacheGroups: {
 *        default: false,
 *        vendors: false,
 *        commons: {
 *          name: 'commons',
 *          reuseExistingChunk: true,
 *          minChunks: 1,
 *          chunks: 'all',
 *          test: /node_modules/
 *        },
 *      },
 *    }
 *  }
 * ```
 */
export default class CommonsServerChunkPlugin {
    private chunkName;
    constructor(chunkName?: string);
    apply(compiler: any): void;
    injectCommonsChunk(compilation: any): void;
}
