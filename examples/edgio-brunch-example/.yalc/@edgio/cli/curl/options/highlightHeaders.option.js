"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Option = _interopRequireDefault(require("./Option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _Option.default().argName('highlight-headers').alternativeArgNames('hlh').requiresArgValue().envName('EDGIO_CURL_HIGHLIGHT_HEADERS').description('This will highlight matching headers. This has no effect when using with --json option.').type('array').default(['x-0-', 'cache-control']);

exports.default = _default;
module.exports = exports.default;