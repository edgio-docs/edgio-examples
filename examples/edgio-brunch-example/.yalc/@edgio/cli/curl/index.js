"use strict";

var _handler = _interopRequireDefault(require("./handler"));

var _yargs = _interopRequireDefault(require("yargs"));

var _CurlLogger = _interopRequireDefault(require("./CurlLogger"));

var _chalk = require("chalk");

var _logo = _interopRequireDefault(require("../utils/logo"));

var _json = _interopRequireDefault(require("./options/json.option"));

var _debug = _interopRequireDefault(require("./options/debug.option"));

var _saveBody = _interopRequireDefault(require("./options/saveBody.option"));

var _showBody = _interopRequireDefault(require("./options/showBody.option"));

var _maxBodyLength = _interopRequireDefault(require("./options/maxBodyLength.option"));

var _curlBinPath = _interopRequireDefault(require("./options/curlBinPath.option"));

var _printTelemetry = _interopRequireDefault(require("./options/printTelemetry.option"));

var _printVersionInfo = _interopRequireDefault(require("./options/printVersionInfo.option"));

var _printSplitTestingInfo = _interopRequireDefault(require("./options/printSplitTestingInfo.option"));

var _highlightHeaders = _interopRequireDefault(require("./options/highlightHeaders.option"));

const _excluded = ["_"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

_yargs.default.parserConfiguration({
  // This is required because we need to pass all unknown options to curl.
  // We capture internal options and rest will be forwared.
  'unknown-options-as-args': true
}).showHelpOnFail(false).command({
  command: ['*'],
  describe: `${_logo.default} ${(0, _chalk.bold)('CURL')}\n - For all possible options refer to: https://curl.se/docs/`,
  builder: command => {
    _json.default.load(command);

    _debug.default.load(command);

    _saveBody.default.load(command);

    _showBody.default.load(command);

    _maxBodyLength.default.load(command);

    _curlBinPath.default.load(command);

    _printTelemetry.default.load(command);

    _printVersionInfo.default.load(command);

    _printSplitTestingInfo.default.load(command);

    _highlightHeaders.default.load(command);
  },
  handler: async argv => {
    const {
      _: userArgs
    } = argv,
          internalArgs = _objectWithoutProperties(argv, _excluded);

    const [_cmd, ...userCurlArgs] = userArgs;
    const logger = new _CurlLogger.default(internalArgs);

    try {
      await (0, _handler.default)(userCurlArgs, internalArgs, {
        logger
      });
      process.exit(0);
    } catch (err) {
      if (internalArgs.json) {
        var _err$constructor;

        logger.json({
          name: ((_err$constructor = err.constructor) === null || _err$constructor === void 0 ? void 0 : _err$constructor.name) || err.name,
          message: err.message,
          stack: err.stack,
          command: err.command
        });
      } else {
        if (internalArgs.debug) {
          logger.error(err.stack);
        } else {
          logger.error(err.message);
        }
      }

      process.exit(1);
    }
  }
}).argv;