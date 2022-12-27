"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Option = _interopRequireDefault(require("./Option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _Option.default().argName('0telemetry').alternativeArgNames('x0t').envName('EDGIO_CURL_PRINT_TELEMETRY').description('This will output decoded telemetry values in x-0-t. This has no effect when using with --json option.').type('boolean').default(true);

exports.default = _default;
module.exports = exports.default;