"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Option = _interopRequireDefault(require("./Option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _Option.default().argName('max-body-length').requiresArgValue().envName('EDGIO_CURL_MAX_BODY_LENGTH').description('Maximum body length that will be returned.').type('number').default(1024);

exports.default = _default;
module.exports = exports.default;