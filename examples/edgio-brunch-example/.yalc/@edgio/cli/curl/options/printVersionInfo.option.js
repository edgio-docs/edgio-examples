"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Option = _interopRequireDefault(require("./Option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _Option.default().argName('0version').alternativeArgNames('x0v').envName('EDGIO_CURL_PRINT_VERSION').description('This will output decoded version values in x-0-version. This has no effect when using with --json option.').type('boolean').default(true);

exports.default = _default;
module.exports = exports.default;