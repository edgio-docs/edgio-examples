"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const init = require('../utils/init');

const useDeployOptions = require('../utils/useDeployOptions');

exports.command = 'init';
exports.describe = 'Adds all required Edgio dependencies and files to your app.';
exports.builder = _objectSpread({
  edgioVersion: {
    type: 'string',
    describe: 'The Edgio version to install.',
    default: 'latest'
  },
  skipEdgioDeps: {
    type: 'boolean',
    describe: 'If true, Edgio packages will not be installed.'
  },
  connector: {
    type: 'string',
    describe: 'The name of a connector package to install and use to prepare your app for deployment on Edgio.'
  },
  name: {
    type: 'string',
    describe: 'The name to give to the site in the Edgio Developer Console.'
  },
  team: {
    type: 'string',
    describe: 'The name of the team to which the site should be deployed.'
  },
  origin: {
    type: 'string',
    describe: 'The domain name or IP address of the origin site.'
  },
  deploy: {
    type: 'boolean',
    describe: 'Include this flag to automatically deploy your site after creation.'
  }
}, useDeployOptions());
exports.handler = init;