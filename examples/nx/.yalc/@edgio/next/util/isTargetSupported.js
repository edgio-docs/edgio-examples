"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
/**
 * Returns true if the 'target' config is supported. This config stopped being supported in Next 12.2
 * @param nextVersion
 * @returns
 */
function isTargetSupported(nextVersion) {
    if (nextVersion) {
        return !semver_1.satisfies(nextVersion, '>= 12.2.0');
    }
    else {
        return true;
    }
}
exports.default = isTargetSupported;
