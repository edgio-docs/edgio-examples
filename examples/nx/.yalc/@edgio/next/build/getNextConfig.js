"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const path_1 = require("path");
function getNextConfig(appDir) {
    const nextConfigPath = path_1.join(appDir, 'next.config.js');
    return require(nextConfigPath);
}
exports.default = getNextConfig;
