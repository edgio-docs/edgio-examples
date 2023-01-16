"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPackageInstalled;

var _resolvePackagePath = _interopRequireDefault(require("resolve-package-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns true if the specified npm package is installed, otherwise false
 * @param {String} pkg
 * @return {Boolean}
 */
function isPackageInstalled(pkg) {
  _resolvePackagePath.default._resetCache();

  const path = (0, _resolvePackagePath.default)(pkg, process.cwd());
  return path != null;
}

module.exports = exports.default;