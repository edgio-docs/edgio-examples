"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printEdgioSplitTesting;

var _chalk = require("chalk");

var _logo = _interopRequireDefault(require("../../utils/logo"));

var _interpolate = _interopRequireDefault(require("../interpolate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// interpolate with gray color default
const iGray = tpl => (0, _interpolate.default)((0, _chalk.gray)(tpl));

function printEdgioSplitTesting(curlResponse, {
  logger,
  internalArgs
}) {
  if (!internalArgs.spl) {
    return;
  }

  const cookies = curlResponse.lastHeaderGroup().cookies;
  const edgioDestination = cookies.findByName('edgio_destination');
  const edgioBucket = cookies.findByName('edgio_bucket');

  if (!edgioDestination || !edgioBucket) {
    return;
  }

  logger.info((0, _chalk.cyan)(`${_logo.default} Split Testing`));
  logger.info(iGray('  Destination         {v}')({
    v: (0, _chalk.cyan)(edgioDestination.value)
  }));
  logger.info(iGray('  Bucket              {v}')({
    v: (0, _chalk.cyan)(edgioBucket.value)
  }));
  logger.info('');
}

module.exports = exports.default;