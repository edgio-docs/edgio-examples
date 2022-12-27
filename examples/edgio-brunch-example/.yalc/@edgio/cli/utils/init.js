"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const detectFramework = require('../frameworks/detectFramework');

const {
  installDependencies,
  installCLIGlobally,
  isCLIInstalledGlobally,
  globalCLIInstallCommand,
  isYarnInstalled
} = require('./packageManager');

const addIgnore = require('./addIgnore');

const get = require('lodash/get');

const resolveInPackage = require('./resolveInPackage');

const logo = require('./logo');

const isPackageInstalled = require('../frameworks/isPackageInstalled');

const {
  isMonorepo,
  getAppsToInit
} = require('./monorepo');

const {
  cyan,
  bold
} = require('chalk');

const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} = require('fs');

const {
  join
} = require('path');

const prompts = require('prompts');

const {
  execSync
} = require('child_process');

const deployCommand = require('../commands/deploy').handler;

const setProperty = require('./config/setProperty');

const slash = require('slash');

const getEdgioConfigFilePath = require('./getEdgioConfigFilePath');

module.exports = async function init(args) {
  let {
    deploy,
    context: {
      logger
    }
  } = args;
  let appPaths;
  console.clear();
  logger.title(`🚀 Let's get started with ${logo}!\n`);

  if (isMonorepo()) {
    logger.info(`It looks like you're using a ${cyan(bold('monorepo'))}.\n`);
    appPaths = (await getAppsToInit()) || appPaths;
  } else {
    appPaths = [process.cwd()];
  }

  for await (const appPath of appPaths) {
    process.chdir(appPath);
    await initializeApp(args);
  } // Install the Edgio CLI globally if it doesn't exist


  if (!isCLIInstalledGlobally()) {
    try {
      await installCLIGlobally();
    } catch (e) {
      logger.title(`\nPlease install the ${logo} CLI globally:\n`);
      console.log(cyan(`    ${globalCLIInstallCommand()}`));
    }
  }

  if (!deploy) {
    console.log('');
  }

  if (args.createDir) {
    logger.title(`To change directories to your new ${logo} app:\n`);
    console.log(cyan(`    cd ${args.dirName}\n`));
  }

  logger.title(`To run your app locally:\n`);
  console.log(cyan('    edg dev\n'));
  logger.title(`To ${deploy ? 're' : ''}deploy your app:\n`);
  console.log(cyan('    edg deploy\n'));
};
/**
 * Creates a node package in the current directory if the current directory is not already
 * a node package root
 */


async function ensureNodePackage(args) {
  let createNewApp = true;
  let nodePackageName = null;

  if (isNodePackageRoot()) {
    nodePackageName = getNodePackageName();
    const choices = await prompts([{
      type: 'select',
      name: 'createNewApp',
      message: 'The current directory contains a package.json file. How would you like to proceed?',
      choices: [{
        title: `Add Edgio to the current app${nodePackageName ? ` (${nodePackageName})` : ''}`,
        value: false
      }, {
        title: 'Create a new app',
        value: true
      }]
    }]);
    createNewApp = choices.createNewApp;

    if (createNewApp) {
      args.createDir = true;
    }
  }

  if (!args.name) {
    args.name = nodePackageName;
  }

  if (!args.name) {
    Object.assign(args, (await prompts([{
      name: 'name',
      type: 'text',
      message: `Enter a name for your app`
    }])));
  }

  if (!args.origin) {
    Object.assign(args, (await prompts([{
      type: 'text',
      name: 'origin',
      message: `What is the hostname or IP address of the origin site that you will host on ${logo}?`,
      initial: 'example.com'
    }])));
    args.origin = args.origin.replace(/^https?:\/\//, '');
  }

  if (createNewApp) {
    args.dirName = args.dirName || args.name;

    if (args.createDir == null) {
      Object.assign(args, (await prompts([{
        name: 'createDir',
        message: `Should we create a new directory for your ${logo} app or use the current directory?`,
        type: 'select',
        initial: 0,
        choices: [{
          title: 'Use the current directory',
          value: false
        }, {
          title: 'Create a new directory',
          value: true
        }]
      }])));
    }

    while (args.createDir && existsSync(join(process.cwd(), args.dirName))) {
      Object.assign(args, (await prompts([{
        name: 'dirName',
        type: 'text',
        message: `⚠️  A directory named "${args.dirName}" already exists. Enter the name of the directory to create.`
      }])));
    }

    if (!args.packageManager) {
      if (await isYarnInstalled()) {
        Object.assign(args, (await prompts([{
          type: 'select',
          name: 'packageManager',
          message: 'Which package manager would you like to use?',
          choices: [{
            title: 'npm',
            value: 'npm'
          }, {
            title: 'yarn',
            value: 'yarn'
          }],
          initial: 0
        }])));
      } else {
        args.packageManager = 'npm';
      }
    }

    if (args.packageManager === 'yarn') {
      // packageManager.js will recognize this and use yarn from now on
      process.env.YARN = 'true';
    }

    if (args.createDir) {
      mkdirSync(args.dirName);
      process.chdir(args.dirName);
    }

    execSync(`${args.packageManager} init --yes`, {
      stdio: 'ignore'
    });
  }
}
/**
 * Initializes a new Edgio app in the current working directory
 * @param {*} args
 */


async function initializeApp(args) {
  let {
    connector,
    deploy
  } = args;

  if (connector) {
    args.connector = {
      builder: connector
    };
  } else {
    args.connector = await detectFramework();
  }

  if (!args.connector) {
    await ensureNodePackage(args);
  }

  await installAllDependencies(args);
  addIgnore();
  await runInitScript(args);
  await updateConfig(args);

  if (deploy) {
    await deployCommand(_objectSpread(_objectSpread({}, args), {}, {
      path: '.'
    }));
  }
}
/**
 * Installs all Edgio build and runtime dependencies
 */


async function installAllDependencies({
  context: {
    logger
  },
  connector,
  edgioVersion,
  skipEdgioDeps
}) {
  // add @edgio/* as build time dependencies
  const devDependencies = {
    '@edgio/core': edgioVersion,
    '@edgio/cli': edgioVersion,
    '@edgio/prefetch': edgioVersion,
    '@edgio/devtools': edgioVersion
  };
  const dependencies = {};

  if (connector) {
    if (connector.name) {
      logger.info(`> Found framework ${cyan(bold(connector.name))}.\n`);
    }

    const addLib = (lib, depArray) => {
      const isEdgioLib = lib.startsWith('@edgio/') || lib.startsWith('@layer0/');

      if (isEdgioLib) {
        depArray[lib] = edgioVersion;
      } else {
        // match the name and the version of the library, defaulting to `latest` if no version specified
        // modified from https://stackoverflow.com/a/64880672
        let [, name, version] = /(.+)@[~^]?([\dvx*]+(?:[-.](?:[\dx*]+|alpha|beta))*)/.exec(lib);
        depArray[name] = version || 'latest';
      }
    }; // add runtime dependencies


    if (connector.dependencies) {
      connector.dependencies.forEach(lib => addLib(lib, dependencies));
      await installDependencies(dependencies);
    }

    if (connector.devDependencies) {
      connector.devDependencies.forEach(lib => addLib(lib, devDependencies));
    } // install the connector if it's not already installed or a path to a local directory


    if (!connector.builder.startsWith('./') && !isPackageInstalled(connector.builder)) {
      devDependencies[connector.builder] = edgioVersion;
    }
  }

  await installDependencies(devDependencies, {
    dev: true,
    skipEdgioDeps
  });
}
/**
 * Runs the connector's init script, or the init script in @edgio/core if the connector
 * does not provide one.
 */


async function runInitScript({
  connector
}) {
  let initScript = require(resolveInPackage(get(connector, 'builder', '@edgio/core'), `init`)); // use default export if provided, otherwise use module.exports


  if (initScript.default) {
    initScript = initScript.default;
  }

  await initScript();
}
/**
 * Updates edgio.config.js based on:
 *
 * - name
 * - team
 * - origin
 */


async function updateConfig({
  name,
  team,
  origin
}) {
  const configPath = getEdgioConfigFilePath();
  let source = readFileSync(configPath, 'utf8');

  if (name) {
    source = setProperty(source, 'name', name, {
      after: /module.exports\s*=/
    });
  }

  if (team) {
    source = setProperty(source, 'team', team, {
      after: /module.exports\s*=/
    });
  }

  if (origin) {
    source = setProperty(source, 'domainOrIp', origin, {
      after: /origin:\s*{/
    });
    source = setProperty(source, 'hostHeader', origin, {
      after: /origin:\s*{/
    });
  }

  writeFileSync(configPath, source, 'utf8');
}
/**
 * Returns true if the current directory is the root of a node package.
 */


function isNodePackageRoot() {
  return existsSync(join(process.cwd(), 'package.json'));
}
/**
 * Gets the name of the node package whose root is the current directory.
 * @returns
 */


function getNodePackageName() {
  return require(slash(join(process.cwd(), 'package.json'))).name;
}