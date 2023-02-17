"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getNextConfig_1 = __importDefault(require("../getNextConfig"));
/**
 * Gets the pageExtensions from Next config
 */
function getPageExtensions() {
    return getPageExtensionsFromConfig(getNextConfig_1.default());
}
exports.default = getPageExtensions;
/**
 * Gets the pageExtensions from the specified config.
 * @param nextConfig
 * @returns
 */
function getPageExtensionsFromConfig(nextConfig) {
    // Default extensions should be same as in next default config
    // https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions
    return nextConfig.pageExtensions || ['tsx', 'ts', 'jsx', 'js'];
}
exports.getPageExtensionsFromConfig = getPageExtensionsFromConfig;
