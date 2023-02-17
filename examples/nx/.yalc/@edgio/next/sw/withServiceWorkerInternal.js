"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const path_1 = require("path");
const getDistDir_1 = require("../util/getDistDir");
// @ts-ignore
const next_offline_1 = __importDefault(require("next-offline"));
// @ts-ignore
const workbox_webpack_plugin_1 = require("workbox-webpack-plugin");
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
function withServiceWorkerInternal(_nextConfig) {
    const normalizedNextConfig = typeof _nextConfig === 'function' ? _nextConfig : () => _nextConfig || {};
    const plugin = (...args) => {
        const { workboxOpts, ...config } = normalizedNextConfig(...args);
        const swSrc = path_1.join(process.cwd(), 'sw', 'service-worker.js');
        const distDir = getDistDir_1.getDistDirFromConfig(normalizedNextConfig(...args));
        const result = next_offline_1.default({
            generateInDevMode: true,
            generateSw: false,
            workboxOpts: {
                swSrc,
                swDest: path_1.join(process.cwd(), distDir, 'static', 'service-worker.js'),
                // The asset names for page chunks contain square brackets, eg [productId].js
                // Next internally injects these chunks encoded, eg %5BproductId%5D.js
                // For precaching to work the cache keys need to match the name of the assets
                // requested, therefore we need to transform the manifest entries with encoding.
                manifestTransforms: [
                    (manifestEntries) => {
                        console.log('> Creating service worker...');
                        const manifest = manifestEntries
                            .filter(entry => !entry.url.includes('next/dist') && !entry.url.includes('autostatic/')) // these paths fail in development resulting in the service worker not being installed
                            .map(entry => {
                            entry.url = encodeURI(entry.url);
                            entry.url = entry.url.replace(/\/\//g, '/');
                            return entry;
                        });
                        return { manifest, warnings: [] };
                    },
                ],
                ...workboxOpts,
            },
            ...config,
            webpack(webpackConfig, options) {
                let hasExistingWorkboxPlugins = false;
                // Check if the app already configured to generate a service worker and warn them as this may have adverse effects.
                // To preserve the existing service worker behavior, the user should add this code to their service worker
                // https://docs.edg.io/guides/prefetching#section_service_worker
                webpackConfig.plugins.forEach((plugin) => {
                    var _a;
                    if ((plugin instanceof workbox_webpack_plugin_1.GenerateSW || plugin instanceof workbox_webpack_plugin_1.InjectManifest) &&
                        ((_a = plugin === null || plugin === void 0 ? void 0 : plugin.config) === null || _a === void 0 ? void 0 : _a.swSrc) !== swSrc) {
                        hasExistingWorkboxPlugins = true;
                    }
                });
                if (hasExistingWorkboxPlugins) {
                    console.error('> [edgio/next/config/withServiceWorker] Warning: Detected existing Workbox service worker configuration.');
                    console.error('> This may result in build errors. It is recommended to either remove the existing configuration or the');
                    console.error('> `withServiceWorker` wrapper function from next.config.js config export.');
                }
                if (typeof config.webpack === 'function') {
                    return config.webpack(webpackConfig, options);
                }
                return webpackConfig;
            },
        });
        // Clean up expanded properties to suppress Next warnings in 12.2+
        delete result.generateInDevMode;
        delete result.generateSw;
        delete result.workboxOpts;
        return result;
    };
    if (typeof _nextConfig === 'function') {
        return plugin;
    }
    else {
        return plugin();
    }
}
exports.default = withServiceWorkerInternal;
