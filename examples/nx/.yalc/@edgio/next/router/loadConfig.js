"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const nonWebpackRequire_1 = __importDefault(require("@layer0/core/utils/nonWebpackRequire"));
/**
 * Loads the result of next.config.js from the current working directory.
 * @return the next config object
 */
function loadConfig() {
    const configFile = path_1.join(process.cwd(), 'next.config.js');
    if (moduleExists(configFile)) {
        let config = nonWebpackRequire_1.default(configFile);
        if (typeof config === 'function') {
            config = config();
        }
        return config;
    }
    else {
        return {};
    }
}
exports.default = loadConfig;
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
