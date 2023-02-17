"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const constants_1 = require("../config/constants");
/**
 * Returns true if the runtime version of next.config.js file already exists
 * @param dir Working directory
 * @returns
 */
function nextRuntimeConfigExists(dir = process.cwd()) {
    return fs_1.default.existsSync(path_1.join(process.cwd(), constants_1.NEXT_RUNTIME_CONFIG_FILE));
}
exports.default = nextRuntimeConfigExists;
