"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const utils_1 = require("@edgio/core/utils");
const path_1 = require("path");
/**
 * Gets the data in next.config.js
 * @param appDir The root directory of the app, defauts to the current working directory
 * @returns
 */
function getNextConfig(appDir = process.cwd()) {
    const configFile = path_1.join(appDir, 'next.config.js');
    if (moduleExists(configFile)) {
        let config = utils_1.nonWebpackRequire(configFile);
        if (typeof config === 'function') {
            config = config('phase-production-build');
        }
        return config;
    }
    else {
        return {};
    }
}
exports.default = getNextConfig;
/**
 * Returns `true` if a module exists, otherwise `false`.
 * @param mod A module path
 */
function moduleExists(mod) {
    try {
        eval('require.resolve')(mod);
        return true;
    }
    catch (e) {
        return false;
    }
}
