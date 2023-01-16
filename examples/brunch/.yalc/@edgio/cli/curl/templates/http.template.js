"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _interpolate = _interopRequireDefault(require("../interpolate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _interpolate.default)(`
  DNS Lookup    TCP Connection   Server Processing   Content Transfer
[   {a0000}   |     {a0001}    |      {a0003}      |      {a0004}     ]
              |                |                   |                  |
    namelookup:{b0000}         |                   |                  |
                        connect:{b0001}            |                  |
                                      starttransfer:{b0003}           |
                                                                 total:{b0004}
`);

exports.default = _default;
module.exports = exports.default;