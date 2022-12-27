"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _template = _interopRequireDefault(require("lodash/template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// e.g interpolate(" {var1} {var2}! ")({ var1: 'hello', var2: 'world' })
const regex = /{([\s\S]+?)}/g;

var _default = tpl => {
  return (0, _template.default)(tpl, {
    interpolate: regex
  });
};

exports.default = _default;
module.exports = exports.default;