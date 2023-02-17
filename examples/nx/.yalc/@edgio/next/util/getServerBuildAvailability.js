"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const getNextVersion_1 = __importDefault(require("./getNextVersion"));
const isTargetSupported_1 = __importDefault(require("./isTargetSupported"));
let memoized;
exports.getServerBuildAvailability = ({ config, quiet = false, }) => {
    if (!memoized) {
        const nextVersion = getNextVersion_1.default();
        let serverBuildAvailable = false, useServerBuild = false, standaloneBuildConfig = {};
        if (process.env.NEXT_FORCE_SERVER_BUILD) {
            useServerBuild = true;
            standaloneBuildConfig = { output: 'standalone' };
        }
        else if (nextVersion) {
            serverBuildAvailable = semver_1.satisfies(nextVersion, '>= 12.0.0');
            if (!isTargetSupported_1.default(nextVersion)) {
                useServerBuild = true;
                standaloneBuildConfig = { output: 'standalone' };
            }
            else if (serverBuildAvailable && config.target === 'server') {
                useServerBuild = true;
                standaloneBuildConfig = { experimental: { outputStandalone: true } };
            }
        }
        if (serverBuildAvailable && !useServerBuild && !quiet) {
            console.warn('[Edgio]', '@edgio/next will utilize the "server" target by default in future versions.');
            console.warn('[Edgio]', 'Opt in early by setting "target: server" in your next.config.js file.');
            console.warn('[Edgio]', 'More information: https://docs.edg.io/guides/next#section_next_js_version_12_and_next_js_middleware__beta_');
        }
        memoized = { serverBuildAvailable, useServerBuild, standaloneBuildConfig };
    }
    return memoized;
};
