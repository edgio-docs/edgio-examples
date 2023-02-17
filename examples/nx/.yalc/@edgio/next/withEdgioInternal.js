"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const getNextVersion_1 = __importDefault(require("./util/getNextVersion"));
const getServerBuildAvailability_1 = require("./util/getServerBuildAvailability");
const isTargetSupported_1 = __importDefault(require("./util/isTargetSupported"));
const CommonsServerChunkPlugin_1 = __importDefault(require("./webpack/CommonsServerChunkPlugin"));
const config_1 = __importDefault(require("@edgio/core/config"));
const determineTarget = ({ useServerBuild, target, }) => {
    /* istanbul ignore next */
    return useServerBuild
        ? 'server'
        : target === 'serverless'
            ? 'serverless'
            : 'experimental-serverless-trace';
};
function isEdgioDevtoolsInstalled() {
    try {
        require('@edgio/devtools/widget/install');
        return true;
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND')
            return false;
        throw e;
    }
}
module.exports = function withEdgioInternal(_nextConfig) {
    const normalizedNextConfig = typeof _nextConfig === 'function' ? _nextConfig : () => _nextConfig || {};
    const plugin = (...args) => {
        var _a, _b, _c;
        const nextConfig = normalizedNextConfig(...args);
        const { useServerBuild, standaloneBuildConfig } = getServerBuildAvailability_1.getServerBuildAvailability({
            config: nextConfig,
            quiet: true,
        });
        // validateNextConfig looks for this to ensure that the configuration is valid
        process.env.WITH_EDGIO_APPLIED = 'true';
        process.env.EDGIO_SOURCE_MAPS = nextConfig.edgioSourceMaps === false ? 'false' : 'true';
        // By default all next/image images are proxied to our image optimizer
        // When our image optimizer is disabled we need to transform relative paths to absolute paths
        // and add allowed domains to config for next/image optimizer
        const disableImageOptimizer = config_1.default.get('disableImageOptimizer', false);
        const predefinedDomains = disableImageOptimizer
            ? ['localhost', '127.0.0.1', '[::1]', 'SET_EDGIO_IMAGE_OPTIMIZER_HOST_HERE']
            : [];
        const result = {
            ...nextConfig,
            ...standaloneBuildConfig,
            images: {
                ...((_a = nextConfig.images) !== null && _a !== void 0 ? _a : {}),
                domains: [...predefinedDomains, ...((_c = (_b = nextConfig.images) === null || _b === void 0 ? void 0 : _b.domains) !== null && _c !== void 0 ? _c : [])],
            },
            experimental: {
                ...nextConfig.experimental,
                ...standaloneBuildConfig.experimental,
            },
            webpack: (config, options) => {
                var _a, _b;
                const webpackConfig = { ...(((_a = nextConfig.webpack) === null || _a === void 0 ? void 0 : _a.call(nextConfig, config, options)) || config) };
                if (options.webpack.version.startsWith('5')) {
                    Object.assign(config, {
                        resolve: {
                            ...config.resolve,
                            fallback: {
                                ...(_b = config.resolve) === null || _b === void 0 ? void 0 : _b.fallback,
                                process: false,
                            },
                        },
                    });
                }
                if (!options.isServer && !nextConfig.disableEdgioDevTools) {
                    // Adding Devtools to client JS file
                    if (isEdgioDevtoolsInstalled()) {
                        const originalEntry = config.entry;
                        config.entry = async () => {
                            const entries = await originalEntry();
                            if (!entries['main.js'].includes('@edgio/devtools/widget/install')) {
                                entries['main.js'].unshift('@edgio/devtools/widget/install');
                            }
                            return entries;
                        };
                    }
                }
                if (options.isServer &&
                    (options.nextRuntime == null || options.nextRuntime === 'nodejs') && // make sure we aren't building middelware (options.nextRuntime === 'edge') or this will break
                    process.env.NODE_ENV === 'production') {
                    if (nextConfig.edgioSourceMaps) {
                        // We force the 'source-map' value as this is what we expect to consume on
                        // our lambda infrastructure
                        config.devtool = 'source-map';
                    }
                    if (!useServerBuild) {
                        config.plugins.push(new CommonsServerChunkPlugin_1.default());
                        config.output.chunkFilename = '[name].js';
                        config.optimization.splitChunks = {
                            cacheGroups: {
                                default: false,
                                vendors: false,
                                commons: {
                                    // Note that the name of the chunk is very important.  If the name doesn't include "webpack-runtime",
                                    // Next.js's PagesManifestPlugin will fail to include each page in the server build's pages-manifest.json
                                    // and the build will fail with an error like "module not found for page /".
                                    // See this line in PagesManifestPlugin:
                                    // https://github.com/vercel/next.js/blob/210a6980d2d630e0ed7c67552a6ebf96921dac15/packages/next/build/webpack/plugins/pages-manifest-plugin.ts#L38
                                    name: 'webpack-runtime-commons',
                                    reuseExistingChunk: true,
                                    minChunks: 1,
                                    chunks: 'all',
                                    test: /node_modules/,
                                },
                            },
                        };
                    }
                }
                return Object.assign(webpackConfig, config);
            },
        };
        if (isTargetSupported_1.default(getNextVersion_1.default())) {
            result.target = determineTarget({ useServerBuild, target: nextConfig.target });
        }
        // Clean up expanded properties to suppress Next warnings in 12.2+
        delete result.edgioSourceMaps;
        delete result.disableEdgioDevTools;
        return result;
    };
    if (typeof _nextConfig === 'function') {
        return plugin;
    }
    else {
        return plugin();
    }
};
