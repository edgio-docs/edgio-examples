"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printRequestMeta;

const chalk = require('chalk');
/**
 * Example:
 *
 * URL :  docs.edg.io 🔗
 * From:  192.168.1.104:55829 🖥️
 * To  :  208.69.180.11:80 🌎
 *
 */


function printRequestMeta(curlResponse, {
  logger
}) {
  logger.info(`URL :  ${chalk.cyan(curlResponse.variables.urlEffective)} 🔗`);
  logger.info(`From:  ${chalk.cyan(curlResponse.variables.localIp)}:${chalk.cyan(curlResponse.variables.localPort)} 🖥️`);
  logger.info(`To  :  ${chalk.cyan(curlResponse.variables.remoteIp)}:${chalk.cyan(curlResponse.variables.remotePort)} 🌎`);
  logger.info('');
}

module.exports = exports.default;