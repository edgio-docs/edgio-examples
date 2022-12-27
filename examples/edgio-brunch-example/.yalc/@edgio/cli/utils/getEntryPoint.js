"use strict";

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const resolveInPackage = require('./resolveInPackage');

const getEdgioConfig = require('./getEdgioConfig');

const slash = require('slash');

const {
  join
} = require('path');

const {
  existsSync
} = require('fs');

const {
  getInstallCommand
} = require('./packageManager');

const chalk = require('chalk');

const detectFramework = require('../frameworks/detectFramework');
/**
 * Gets the specified entrypoint based on the value of the connector property in edgio.config.js
 * @param {String} name The entry point name
 * @return {Object} The default export or module.exports of the entrypoint
 */


module.exports = async function getEntryPoint(name) {
  let {
    connector
  } = getEdgioConfig();
  let entryPoint;

  if (!connector) {
    // fallback to framework detection if no connector is specified in edgio.config.js
    let framework;

    try {
      framework = await detectFramework();
    } catch (e) {// will get here if there is no package.json
    }

    if (framework) {
      connector = process.env.EDGIO_CONNECTOR = framework.builder;
      console.log(`Detected framework ${framework.name}. Using connector ${connector}.`);
      console.warn(chalk.yellow(`Warning: Not explicitly declaring an Edgio connector is deprecated. Please add the following to edgio.config.js:`));
      console.warn(`\n  connector: '${connector}',\n`);
    } else {
      connector = '@edgio/core';
    }
  }

  if (connector.startsWith('.')) {
    // relative path - ad hoc connector in the app itself
    entryPoint = [join(process.cwd(), connector, `${name}.cjs`), // CommonJS - use require
    join(process.cwd(), connector, `${name}.mjs`), // ES Module - use import
    join(process.cwd(), connector, `${name}.js`) // Treating as CommonJS - use require
    ].find(file => existsSync(file));

    if (!entryPoint) {
      // Load the entry point default from the core.
      entryPoint = resolveInPackage('@edgio/core', name);
    }
  } else {
    // a connector package
    try {
      entryPoint = resolveInPackage(connector, name);
    } catch (e) {
      console.error(`Connector package ${connector} not found. Try installing it with\n\n  ${chalk.yellow(`${getInstallCommand()} ${connector}`)}\n`);
      process.exit(1);
    }
  }

  const mod = entryPoint.endsWith('.mjs') ? Promise.resolve(`${slash(entryPoint)}`).then(s => _interopRequireWildcard(require(s))) : require(slash(entryPoint));
  return mod.default || mod;
};