"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Option = _interopRequireDefault(require("./Option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _Option.default().argName('curl-bin-path').requiresArgValue().envName('EDGIO_CURL_BIN_PATH').description('Allows overriding path to curl bin. This is only required when curl is not in $PATH or you need to run different versions of curl.').type('string').default('curl');

exports.default = _default;
module.exports = exports.default;