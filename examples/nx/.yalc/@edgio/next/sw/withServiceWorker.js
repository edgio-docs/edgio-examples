"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Only node build-in modules and connector imports are allowed. All other imports have to be dynamic.
*/
const nextRuntimeConfigExists_1 = __importDefault(require("../util/nextRuntimeConfigExists"));
function withServiceWorker(_nextConfig) {
    // We just return received config when the runtime version of next.config.js file already exists
    if (nextRuntimeConfigExists_1.default())
        return _nextConfig;
    // This code is executed only during the build of next.config.js file and when app is running in development mode
    return require('./withServiceWorkerInternal').default(_nextConfig);
}
exports.withServiceWorker = withServiceWorker;
exports.default = withServiceWorker;
