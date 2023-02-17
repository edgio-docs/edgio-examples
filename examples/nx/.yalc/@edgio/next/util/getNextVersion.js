"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_package_path_1 = __importDefault(require("resolve-package-path"));
/**
 * Returns the installed version of Next.js
 * @returns
 */
function getNextVersion() {
    // This will return the path to the main module, which will not necessarily be in the root
    // directory of the package. Next.js is one such example.
    const packagePath = resolve_package_path_1.default('next', process.cwd());
    if (!packagePath) {
        return null;
    }
    return eval('require')(packagePath).version;
}
exports.default = getNextVersion;
