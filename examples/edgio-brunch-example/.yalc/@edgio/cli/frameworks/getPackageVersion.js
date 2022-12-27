"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPackageVersion;

var _parse = _interopRequireDefault(require("semver/functions/parse"));

var _resolvePackagePath = _interopRequireDefault(require("resolve-package-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copied from @layer/core, we don't have direct dependency on core
// so this is quick and dirty fix until we change the cli and bundle
// everything to one file

/**
 * Returns the semver version of the specified package. Returns null if the package cannot be found or does not have a main export
 * @param packageName
 * @returns
 */
function getPackageVersion(packageName) {
  // This will return the path to the main module, which will not necessarily be in the root
  // directory of the package. Next.js is one such example.
  const packagePath = (0, _resolvePackagePath.default)(packageName, process.cwd());
  return packagePath ? (0, _parse.default)(eval('require')(packagePath).version) : null;
}

module.exports = exports.default;