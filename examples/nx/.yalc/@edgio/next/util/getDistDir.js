"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getNextConfig_1 = __importDefault(require("../getNextConfig"));
/**
 * Gets the build output directory for Next.js
 */
function getDistDir() {
    return getDistDirFromConfig(getNextConfig_1.default());
}
exports.default = getDistDir;
/**
 * Gets the build output directory for Next.js from the specified config.
 * @param nextConfig
 * @returns
 */
function getDistDirFromConfig(nextConfig) {
    return (nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.distDir) || '.next';
}
exports.getDistDirFromConfig = getDistDirFromConfig;
