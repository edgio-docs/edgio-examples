"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const setProperty = require('../../utils/config/setProperty');

const useDeployOptions = require('../../utils/useDeployOptions');

const {
  readFileSync,
  writeFileSync
} = require('fs');

const {
  handler: deployHandler
} = require('../deploy');

const getEdgioConfigFilePath = require('../../utils/getEdgioConfigFilePath');

exports.command = 'set-backend <backend>';
exports.describe = 'Sets the specified backend configuration options';
exports.builder = _objectSpread({
  domainOrIp: {
    type: 'string',
    alias: 'd',
    describe: 'The domain name or IP Address of the backend server.'
  },
  hostHeader: {
    type: 'string',
    alias: 'h',
    describe: 'The host header to be sent to the backend server.'
  },
  deploy: {
    type: 'boolean',
    describe: 'Include this flag to deploy your site after applying the configuration changes.'
  }
}, useDeployOptions());

exports.handler = async yargs => {
  const {
    context: {
      logger
    },
    backend,
    domainOrIp,
    hostHeader
  } = yargs;

  try {
    console.log(`> Updating '${backend}' backend...`);
    const after = new RegExp(`${backend}: {`);
    const configPath = getEdgioConfigFilePath();

    if (!configPath) {
      throw new Error("No edgio.config.js found. Please ensure you are in your app's root directory.");
    }

    let source = readFileSync(configPath, 'utf8');

    if (domainOrIp) {
      source = setProperty(source, 'domainOrIp', domainOrIp, {
        after
      });
    }

    if (hostHeader) {
      source = setProperty(source, 'hostHeader', hostHeader, {
        after
      });
    }

    writeFileSync(configPath, source, 'utf8');
    console.log(`> Backend '${yargs.backend}' has been updated.`);
  } catch (e) {
    logger.error(`> An error occurred while attempting to update the backend config:`);
    console.log(e.message);
    process.exit(1);
  }

  if (yargs.deploy) {
    await deployHandler(yargs);
  }
};