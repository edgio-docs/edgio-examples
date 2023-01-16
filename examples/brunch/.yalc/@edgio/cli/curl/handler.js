'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handler;

var _Curl = _interopRequireDefault(require("./Curl"));

var _printRequestMeta = _interopRequireDefault(require("./print/printRequestMeta"));

var _printResponseHeaders = _interopRequireDefault(require("./print/printResponseHeaders"));

var _printResponseBody = _interopRequireDefault(require("./print/printResponseBody"));

var _printEdgioTelemetry = _interopRequireDefault(require("./print/printEdgioTelemetry"));

var _printCurlTimingTable = _interopRequireDefault(require("./print/printCurlTimingTable"));

var _printEdgioVersion = _interopRequireDefault(require("./print/printEdgioVersion"));

var _printEdgioSplitTesting = _interopRequireDefault(require("./print/printEdgioSplitTesting"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function handler(userCurlArgs, internalArgs, {
  logger
}) {
  logger.debug(`> Internal Arguments: ${JSON.stringify(internalArgs)}`);
  logger.debug(`> User Curl Arguments: ${JSON.stringify(userCurlArgs)}`);
  logger.debug('');
  const curlResponse = await _Curl.default.run(userCurlArgs, internalArgs); // Returning early for json output since everything forward is only for making it look good in terminal
  // Logger is disabled during --json anyway.

  if (internalArgs.json) {
    logger.json(curlResponse.toJsonObject());
    return;
  }

  logger.debug(`> Executed: "${curlResponse.command}"\n`);
  logger.debug('> Curl Format Output:');
  logger.debug(`${JSON.stringify(curlResponse.variables, null, 2)}\n`); // Log Std Err to display curl debug output

  if (curlResponse.stderr) {
    logger.info(`${curlResponse.stderr}\n`);
  } // 🖨️


  const printerContext = {
    logger,
    internalArgs,
    userCurlArgs
  };
  await (0, _printRequestMeta.default)(curlResponse, printerContext);
  await (0, _printResponseHeaders.default)(curlResponse, printerContext);
  await (0, _printEdgioVersion.default)(curlResponse, printerContext);
  await (0, _printEdgioSplitTesting.default)(curlResponse, printerContext);
  await (0, _printEdgioTelemetry.default)(curlResponse, printerContext);
  await (0, _printCurlTimingTable.default)(curlResponse, printerContext);
  await (0, _printResponseBody.default)(curlResponse, printerContext);
}

module.exports = exports.default;