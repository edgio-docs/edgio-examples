"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInstallCommand = getInstallCommand;
exports.getNodePackageInfo = getNodePackageInfo;
exports.globalCLIInstallCommand = globalCLIInstallCommand;
exports.installCLIGlobally = installCLIGlobally;
exports.installDependencies = installDependencies;
exports.isCLIInstalledGlobally = isCLIInstalledGlobally;
exports.isYarn = isYarn;
exports.isYarnInstalled = isYarnInstalled;
exports.isYarnVersion = isYarnVersion;
exports.runNodePackageManagerScript = runNodePackageManagerScript;
exports.uninstallDependencies = uninstallDependencies;

var _ora = _interopRequireDefault(require("ora"));

var _chalk = _interopRequireDefault(require("chalk"));

var _path = require("path");

var _fs = require("fs");

var _run = _interopRequireDefault(require("./run"));

var _logo = _interopRequireDefault(require("./logo"));

var _resolveGlobal = _interopRequireDefault(require("resolve-global"));

var _commandExists = _interopRequireDefault(require("command-exists"));

var _checkNodeVersion = _interopRequireDefault(require("check-node-version"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns true if yarn is installed, otherwise false
 * @returns
 */
async function isYarnInstalled() {
  try {
    return await (0, _commandExists.default)('yarn');
  } catch (e) {
    return false;
  }
}
/**
 * Returns if the user is using yarn or npm based on the lock file
 */


function isYarn() {
  return process.env.YARN === 'true' || (0, _fs.existsSync)((0, _path.join)(process.cwd(), 'yarn.lock'));
}
/**
 * Returns `true` if the current yarn version matches the supplied semver
 * @param {string} version
 * @returns
 */


async function isYarnVersion(version) {
  return new Promise(resolve => (0, _checkNodeVersion.default)({
    yarn: String(version)
  }, (error, result) => {
    resolve(result.isSatisfied);
  }));
}
/**
 * Gets the install command for the package manager being used in the user's project
 */


function getInstallCommand() {
  return isYarn() ? 'yarn add --dev' : 'npm i -D';
}
/**
 * Runs npm or yarn command with args based on the package manager used
 * @param {String[]} commandArgs
 */


function runNodePackageManagerScript(commandArgs = [], {
  stdio
} = {}) {
  const command = isYarn() ? 'yarn' : 'npm';
  return (0, _run.default)(command, commandArgs, {
    stdio
  });
}
/**
 *
 * @param {string} packageName Npm package name
 * @returns Package info equal to: npm info @edgio/cli --json
 */


function getNodePackageInfo(packageName) {
  return runNodePackageManagerScript(['info', packageName, '--json']);
}
/**
 * Installs packages if they are not already installed.
 * @param {Object} libs The libs to install.  Keys are the names of node packages and values are versions
 * @param {Object} options
 * @param {Object} options.dev If true, the libs will be installed as devDependencies.
 * @param {Object} options.skipEdgioDeps If true, @edgio libs will not be installed. Useful for yalc-ing during development
 * @return {Promise}
 */


async function installDependencies(libs, {
  dev = false,
  skipEdgioDeps = false
} = {}) {
  const toInstall = [],
        packageNames = [];

  for (let lib in libs) {
    if (skipEdgioDeps && lib.startsWith('@edgio')) {
      continue;
    }

    packageNames.push(lib);
    toInstall.push(`${lib}@${libs[lib]}`);
  }

  if (toInstall.length === 0) return Promise.resolve();
  await manageDependencies(true, dev, toInstall);
}
/**
 * Uninstalls packages
 * @param {String|String[]} libs The libs to uninstall. Values are the names of node packages
 * @return {Promise}
 */


async function uninstallDependencies(lib) {
  await manageDependencies(false, null, Array.isArray(lib) ? lib : [lib]);
}
/**
 * Returns the command that the user can run to install @edgio/cli globally using the current package manager.
 * @returns
 */


function globalCLIInstallCommand() {
  if (isYarn()) {
    return 'yarn global add @edgio/cli';
  } else {
    return 'npm i -g @edgio/cli';
  }
}
/**
 * Installs @edgio/cli globally using the current package manager.
 */


async function installCLIGlobally() {
  const message = `installing the ${_logo.default} CLI...`;
  const spinner = (0, _ora.default)(message).start();

  try {
    if (isYarn()) {
      await (0, _run.default)('yarn', ['global', 'add', '@edgio/cli']);
    } else {
      await (0, _run.default)('npm', ['i', '-g', '@edgio/cli']);
    }

    spinner.succeed(`${message} done.`);
  } catch (e) {
    spinner.fail(`${message} failed.\n`);
    throw e;
  }
}
/**
 * Returns true if @edgio/cli is installed globally, otherwise false.
 */


function isCLIInstalledGlobally() {
  try {
    (0, _resolveGlobal.default)('@edgio/cli');
    return true;
  } catch (e) {
    return false;
  }
}

async function manageDependencies(install, dev, deps) {
  const message = `${install ? '' : 'un'}installing ${_chalk.default.green(deps.join(', '))}...`;
  const spinner = (0, _ora.default)(message).start();
  const commandArgs = [];

  if (isYarn()) {
    commandArgs.push(install ? 'add' : 'remove');

    if (await isYarnVersion(1)) {
      commandArgs.push('--ignore-workspace-root-check');
    }

    install && dev && commandArgs.push('--dev');
  } else {
    commandArgs.push(install ? 'install' : 'uninstall');
    install && commandArgs.push(dev ? '--save-dev' : '--save');
  }

  try {
    await runNodePackageManagerScript([...commandArgs, ...deps]);
    spinner.succeed(`${message} done.`);
    return Promise.resolve();
  } catch (e) {
    spinner.fail(`${message} failed.\n`);
    return Promise.reject(e);
  }
}