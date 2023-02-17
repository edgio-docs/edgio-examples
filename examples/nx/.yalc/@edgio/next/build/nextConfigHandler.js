"use strict";
/**
 *  This file is copied to lambda folder
 *  and serves Next config based on used properties.
 *  The final next.config.js file is bundled handler file with buildtime version of next.config.js.
 *
 *  DO NOT replace the filenames by constants,
 *  esbuild will not include the files to bundle then.
 */
var _a, _b, _c, _d;
let config = require('./next.config.buildtime.js');
if (Object.keys((_a = config.serverRuntimeConfig) !== null && _a !== void 0 ? _a : {}).length > 0 ||
    Object.keys((_b = config.publicRuntimeConfig) !== null && _b !== void 0 ? _b : {}).length > 0) {
    let runtimeConfig = require('./next.config.runtime.js');
    runtimeConfig = typeof runtimeConfig === 'function' ? runtimeConfig() : runtimeConfig;
    config = {
        ...config,
        serverRuntimeConfig: (_c = runtimeConfig.serverRuntimeConfig) !== null && _c !== void 0 ? _c : {},
        publicRuntimeConfig: (_d = runtimeConfig.publicRuntimeConfig) !== null && _d !== void 0 ? _d : {},
    };
}
module.exports = config;
