"use strict";

var _path = require("path");

var _resolvePackagePath = _interopRequireDefault(require("resolve-package-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * During build initialization we need to know core Edgio version
 * before any of the build is actually done.
 *
 * Notes:
 * - CLI may be global but not local.
 * - CLI must not depend on @edgio/core to avoid long installation times.
 */
module.exports = function getCoreEdgioVersion() {
  _resolvePackagePath.default._resetCache();

  const path = (0, _resolvePackagePath.default)('@edgio/core', process.cwd());

  if (!path) {
    return null;
  }

  const {
    DeploymentBuilder
  } = require((0, _path.join)((0, _path.dirname)(path), 'deploy'));

  return DeploymentBuilder.edgioVersion;
};