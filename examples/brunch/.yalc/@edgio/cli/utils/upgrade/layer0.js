"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const globby = require('globby');

const {
  join,
  dirname
} = require('path');

const chalk = require('chalk');

const fs = require('fs-extra');

const prompts = require('prompts');

const replaceInFiles = require('replace-in-files');

const _unique = require('lodash/uniq');

const {
  uninstallDependencies,
  installDependencies
} = require('../packageManager');

const {
  isDirty
} = require('../git');

const {
  loadPackageJson
} = require('../EdgioPackageJson');

const addIgnore = require('../addIgnore');

const symbolsToRename = [[/@layer0/g, '@edgio'], [/layer0/g, 'edgio'], [/Layer0/g, 'Edgio']]; // ignored during symbol replace

const ignorePaths = ['node_modules', '.*'].map(path => `**/${path}/**`);
const ignoreFiles = ['package-lock.json', 'yarn.lock'];

module.exports = function () {
  let projectPath = '.',
      logger;

  async function checkExistingConfig() {
    try {
      await fs.stat(join(projectPath, 'edgio.config.js')); // if we've made it here, the config file exists so we assume there is nothing to upgrade

      logger.warn(`[SKIPPED] '${projectPath}' contains an existing 'edgio.config.js' configuration.`);
      process.exit(0);
    } catch (e) {
      /*ignore*/
    }
  }

  async function confirmFilesToChange() {
    const renamePaths = await getPathsToRename(projectPath);
    const modifyPaths = await getPathsToModify(projectPath);
    console.log('');
    logger.warn('The following paths will be renamed/moved:\n', renamePaths.map(([oldPath, newPath]) => `\t- ${chalk.red(oldPath)} => ${chalk.green(newPath)}`).join('\n'), '\n');
    console.log('');
    logger.warn('The following files will be modified:\n', modifyPaths.map(path => `\t- ${chalk.red(path)}`).join('\n'), '\n');
    const {
      confirm
    } = await prompts({
      name: 'confirm',
      type: 'confirm',
      message: 'Do you wish to continue?',
      initial: true
    });
    return confirm;
  }
  /**
   * Gets a list of paths that will be renamed/moved
   * @returns {Array}
   */


  async function getPathsToRename() {
    const paths = await globby(['*layer0*', '**/*layer0*/**'], {
      expandDirectories: true,
      gitignore: true,
      ignore: ignorePaths,
      cwd: projectPath
    });
    return paths.map(path => {
      path = join(projectPath, path);
      return [path, path.replace('layer0', 'edgio')];
    });
  }
  /**
   * Gets a unique list of paths that will be modified during symbol replacement
   * @param {String} projectPath
   * @returns {Array}
   */


  async function getPathsToModify() {
    const result = await renameSymbols(true);
    const paths = result.reduce((acc, {
      paths
    }) => {
      acc.push(...paths);
      return acc;
    }, []);
    return _unique(paths).sort();
  }

  async function renameFiles() {
    const paths = await getPathsToRename(projectPath); // rename files/dirs

    for (let [oldPath, newPath] of paths) {
      const newDir = dirname(newPath);

      try {
        await fs.ensureDir(newDir);
        await fs.rename(oldPath, newPath);
      } catch (e) {
        logger.error(`Error renaming ${oldPath}`, e.message);
      }
    }
  }

  async function renameSymbols(dryRun = true) {
    const replaceOptions = {
      files: [join(projectPath, '**/*.(js|ts|cjs|mjs|json)')],
      optionsForFiles: {
        ignore: [...ignorePaths, ...ignoreFiles]
      },
      saveOldFile: false,
      onlyFindPathsWithoutReplace: dryRun
    }; // rename symbols in source

    const results = [];

    for (let [from, to] of symbolsToRename) {
      results.push((await replaceInFiles(_objectSpread(_objectSpread({}, replaceOptions), {}, {
        from,
        to
      }))));
    }

    return results;
  }

  async function cleanPackageJson(upgradeVersion) {
    const filterFn = key => key.startsWith('@layer0');

    const reduceFn = (acc, val) => {
      acc[val.replace('@layer0', '@edgio')] = upgradeVersion;
      return acc;
    };

    const pkg = loadPackageJson(projectPath);
    const deps = Object.keys(pkg.dependencies || {}).filter(filterFn);
    const devDeps = Object.keys(pkg.devDependencies || {}).filter(filterFn); // remove all @layer0 dependencies

    await uninstallDependencies([...deps, ...devDeps]); // install the same dependencies with @edgio namespace

    await installDependencies(deps.reduce(reduceFn, {}), {
      dev: false
    });
    await installDependencies(devDeps.reduce(reduceFn, {}), {
      dev: true
    });
  }

  return async function layer0Upgrade(args) {
    const {
      context,
      nonInteractive,
      ignoreDirty,
      path
    } = args;
    projectPath = path;
    logger = context.logger; // ensure the working tree has no uncommitted changes

    if (!ignoreDirty && (await isDirty())) {
      logger.warn('The current working branch has uncommitted changes.', 'Please commit or stash before continuing.', 'Optionally, pass `--ignore-dirty` to continue.');
      process.exit(0);
    } // check for existing Edgio configuration


    await checkExistingConfig();

    if (!nonInteractive) {
      const confirm = await confirmFilesToChange();

      if (!confirm) {
        process.exit(0);
      }
    }

    try {
      await logger.step('📦 Updating packages...', async () => {
        await cleanPackageJson(args.edgioVersion || 'latest');
      });
      await logger.step('Moving files and replacing symbols...', async () => {
        await renameFiles();
        await renameSymbols(false);
        await addIgnore(projectPath);
      });
    } catch (e) {
      logger.error('An error has been encountered during the upgrade process.', (await isDirty()) ? chalk.bold('Please discard all changes.') : '', `\n\nError: ${e.message}`);
      throw e;
    }
  };
}();