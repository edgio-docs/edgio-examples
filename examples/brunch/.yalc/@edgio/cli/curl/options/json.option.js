"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Option = _interopRequireDefault(require("./Option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _Option.default().argName('json').envName('EDGIO_CURL_JSON_FORMAT').description('Return JSON format only.').type('boolean').default(false);

exports.default = _default;
module.exports = exports.default;