"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printCurlTimingTable;

var _chalk = _interopRequireDefault(require("chalk"));

var _lodash = require("lodash");

var _pad = require("../../utils/pad");

var _http = _interopRequireDefault(require("../templates/http.template"));

var _https = _interopRequireDefault(require("../templates/https.template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Example:
 *
 *   DNS Lookup    TCP Connection   Server Processing   Content Transfer
 * [     2ms     |      47ms      |       44ms        |        1ms       ]
 *               |                |                   |                  |
 *     namelookup:2ms             |                   |                  |
 *                         connect:49ms               |                  |
 *                                       starttransfer:93ms              |
 *                                                                  total:94ms
 */
function printCurlTimingTable(curlResponse, {
  logger
}) {
  const {
    time,
    range,
    scheme
  } = curlResponse.variables;
  let template = scheme == 'HTTPS' ? _https.default : _http.default;
  logger.log(template({
    // This is just because template will look more readable when counting
    // spaces. :)
    a0000: _chalk.default.cyan((0, _pad.padCenter)(time.timeNameLookupPretty, 7)),
    a0001: _chalk.default.cyan((0, _pad.padCenter)(range.rangeConnectionPretty, 7)),
    a0002: _chalk.default.cyan((0, _pad.padCenter)(range.rangeSSLPretty, 7)),
    a0003: _chalk.default.cyan((0, _pad.padCenter)(range.rangeServerPretty, 7)),
    a0004: _chalk.default.cyan((0, _pad.padCenter)(range.rangeTransferPretty, 7)),
    b0000: _chalk.default.cyan((0, _lodash.padEnd)(time.timeNameLookupPretty, 7)),
    b0001: _chalk.default.cyan((0, _lodash.padEnd)(time.timeConnectPretty, 7)),
    b0002: _chalk.default.cyan((0, _lodash.padEnd)(time.timePretransferPretty, 7)),
    b0003: _chalk.default.cyan((0, _lodash.padEnd)(time.timeStarttransferPretty, 7)),
    b0004: _chalk.default.cyan((0, _lodash.padEnd)(time.timeTotalPretty, 7))
  }));
}

module.exports = exports.default;