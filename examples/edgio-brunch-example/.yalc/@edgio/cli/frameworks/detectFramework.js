"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detectFramework;

var _frameworks = _interopRequireDefault(require("./frameworks"));

var _EdgioPackageJson = _interopRequireDefault(require("../utils/EdgioPackageJson"));

var _semver = _interopRequireDefault(require("semver"));

var _getPackageVersion3 = _interopRequireDefault(require("./getPackageVersion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Detects the framework being used by the project in the current working
 * directory and installs the `edgio-*` library needed to build it for deployment
 * on Edgio, as well as `@edgio/core`.
 * @return {String} The command to run to build the app for deployment on Edgio.
 */
async function detectFramework() {
  const {
    dependencies = {},
    devDependencies = {}
  } = _EdgioPackageJson.default.loadPackageJson();

  const dependenciesPairs = Object.keys(dependencies).map(key => {
    var _getPackageVersion;

    return {
      package: key,
      version: ((_getPackageVersion = (0, _getPackageVersion3.default)(key)) === null || _getPackageVersion === void 0 ? void 0 : _getPackageVersion.raw) ?? dependencies[key]
    };
  });
  const devDependenciesPairs = Object.keys(devDependencies).map(key => {
    var _getPackageVersion2;

    return {
      package: key,
      // Attempt to read package version from node_modules, if possible
      // otherwise, fallback to the version found in main package.json
      // and coerce the version found there as semver will fail if version
      // name is not clean (aka to get from ^1.2.3 version 1.2.3 which can be compared)
      version: ((_getPackageVersion2 = (0, _getPackageVersion3.default)(key)) === null || _getPackageVersion2 === void 0 ? void 0 : _getPackageVersion2.raw) ?? devDependencies[key]
    };
  });
  const all = dependenciesPairs.concat(devDependenciesPairs).map(pair => ({
    package: pair.package,
    version: _semver.default.coerce(pair.version)
  })); // The frameworks array order is important, the more specific versions
  // has to be defined before less specific version(s). Also some frameworks
  // take priority before others eg vue-storefront vs nuxt

  for (const fw of _frameworks.default) {
    const foundPackageFrameworkMatch = all.find(packageFramework => // If the version is not specified we care only about the name,
    // otherwise we check for framework version too
    fw.frameworkVersion === undefined ? packageFramework.package === fw.framework : packageFramework.package === fw.framework && _semver.default.satisfies(packageFramework.version, fw.frameworkVersion));
    if (foundPackageFrameworkMatch) return fw;
  } // No matching framework has been found


  return undefined;
}

module.exports = exports.default;