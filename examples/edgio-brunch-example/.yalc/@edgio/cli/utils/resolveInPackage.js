"use strict";

/*
This module exists in both cli and core. Otherwise core would need to be a dependency of cli, which
would make cli much slower to install, adding friction to the onboarding process and defeating the
purpose of having a separate cli package.
*/
const resolvePackagePath = require('resolve-package-path');

const {
  dirname,
  join
} = require('path');
/**
 * Returns the path to a file within a node package
 * @param {String} pkg The name of a node package
 * @param {String[]} file The path to the file within the package
 * @return {String}
 */


module.exports = function resolveInPackage(pkg, ...file) {
  resolvePackagePath._resetCache();

  const path = resolvePackagePath(pkg, __dirname) || resolvePackagePath(pkg, process.cwd()); // ^^ the second call to resolvePackagePath above is needed to resolve from packages
  // that are linked with lerna (e.g. the examples in the edgio repo).

  if (!path) throw new Error(`Package ${pkg} not found.`);
  const packagePath = dirname(path);
  return join(packagePath, ...file);
};