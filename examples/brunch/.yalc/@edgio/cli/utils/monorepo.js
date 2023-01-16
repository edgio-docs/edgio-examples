"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppPaths = getAppPaths;
exports.getAppsToInit = getAppsToInit;
exports.isMonorepo = isMonorepo;
exports.locateAppToRunCmd = locateAppToRunCmd;

var _path = require("path");

var _fs = require("fs");

var _prompts = _interopRequireDefault(require("prompts"));

var _globby = _interopRequireDefault(require("globby"));

var _EdgioPackageJson = _interopRequireDefault(require("./EdgioPackageJson"));

var _logo = _interopRequireDefault(require("./logo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isMonorepo() {
  const lerna = (0, _fs.existsSync)((0, _path.join)(process.cwd(), 'lerna.json')) && require((0, _path.join)(process.cwd(), 'lerna.json'));

  const workspaces = _EdgioPackageJson.default.loadPackageJson(process.cwd()).workspaces;

  return workspaces && workspaces.length > 0 || lerna && lerna.packages && lerna.packages.length > 0;
}

async function getAppsToInit() {
  const appPaths = await getAppPaths({
    absolute: true
  });
  const {
    apps
  } = await (0, _prompts.default)([{
    type: 'multiselect',
    message: `Please select the apps that you would like to initialize for ${_logo.default}`,
    name: 'apps',
    choices: appPaths.map(path => ({
      value: path.path,
      title: path.name
    })),
    hint: 'Press space to select, return to continue.',
    instructions: false
  }]);
  return apps;
}

async function locateAppToRunCmd(action) {
  const appPaths = (await getAppPaths()).filter(({
    path
  }) => (0, _fs.existsSync)(`${path}/edgio.config.js`));

  if (appPaths.length === 1) {
    // `globby` is using objectMode: https://github.com/mrmlnc/fast-glob#objectmode
    process.chdir(appPaths[0].path);
  } else if (appPaths.length > 1) {
    const {
      app
    } = await (0, _prompts.default)([{
      type: 'select',
      message: `Select app to ${action}`,
      name: 'app',
      choices: appPaths.map(path => ({
        value: path.path,
        title: path.name
      })),
      instructions: false
    }]);
    app && process.chdir(app);
  }
}

async function getAppPaths(options) {
  let packages;

  if ((0, _fs.existsSync)((0, _path.join)(process.cwd(), 'lerna.json'))) {
    packages = require((0, _path.join)(process.cwd(), 'lerna.json')).packages;
  } // `lerna.json` may be present in the project, but packages/workspaces may still be defined in `package.json`.


  if (!packages) {
    packages = require((0, _path.join)(process.cwd(), 'package.json')).workspaces;
  }

  if (packages && packages.length) {
    return await (0, _globby.default)(packages, _objectSpread({
      onlyDirectories: true,
      expandDirectories: false,
      deep: 1,
      objectMode: true
    }, options));
  } else {
    return [];
  }
}