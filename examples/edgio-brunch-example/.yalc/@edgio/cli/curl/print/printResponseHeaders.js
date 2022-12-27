"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printResponseHeaders;

var _chalk = _interopRequireDefault(require("chalk"));

var _defaultTo = _interopRequireDefault(require("lodash/defaultTo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Example:
 *
 * HTTP/1.1 301
 * Response Headers
 *   date: Wed, 11 May 2022 20
 *   x-request-id: 209ab965af5f6d31fed21cdfbd86f4a3caf18dee
 *   via: Edgio
 *   vary: user-agent
 */
function printResponseHeaders(curlResponse, {
  logger,
  internalArgs: {
    highlightHeaders
  }
}) {
  const totalHeaderGroups = curlResponse.headers.length;

  for (let index = 0; index < totalHeaderGroups; index++) {
    const headerGroup = curlResponse.headers[index];

    if (totalHeaderGroups > 1) {
      logger.info(`( ${index + 1} )`);
    }

    let statusCodeColor = _chalk.default.cyan;

    if (headerGroup.statusCode.match(/^2\d{2}$/)) {
      statusCodeColor = _chalk.default.green;
    } else if (headerGroup.statusCode.match(/^3\d{2}$/)) {
      statusCodeColor = _chalk.default.yellow;
    } else {
      statusCodeColor = _chalk.default.red;
    }

    logger.info(`${_chalk.default.cyan(headerGroup.version)} ${statusCodeColor(headerGroup.statusCode)} ${statusCodeColor(headerGroup.statusMessage)}`);
    logger.info(_chalk.default.cyan('Response Headers'));
    headerGroup.headers.each(header => {
      const highlight = !!(0, _defaultTo.default)(highlightHeaders, []).find(hl => header.name.includes(hl.toLowerCase()));

      if (highlight) {
        logger.info(`  ${_chalk.default.green(header.name)}: ${_chalk.default.cyan(header.value)}`);
      } else {
        logger.info(`  ${_chalk.default.gray(header.name)}: ${_chalk.default.cyan(header.value)}`);
      }
    });
    logger.info(' ');
  }
}

module.exports = exports.default;