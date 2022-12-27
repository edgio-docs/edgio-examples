"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printResponseBody;

var _chalk = _interopRequireDefault(require("chalk"));

var _TmpFile = _interopRequireDefault(require("../../utils/TmpFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Example:
 *
 * Response Body
 *   Disbled. To enable use EDGIO_CURL_SAVE_BODY=1 or EDGIO_CURL_SHOW_BODY=1
 *
 * or
 *
 * Response Body
 *   Default redirect to HTTPS.
 */
async function printResponseBody(curlResponse, {
  logger,
  internalArgs
}) {
  logger.info(_chalk.default.cyan('Response Body')); // Limit response body size that will be logged
  // Full body is still available from tmp file with SAVE_BODY=1

  if (internalArgs.showBody) {
    const isTruncated = curlResponse.truncatedBody.length < curlResponse.body.length;
    logger.log(`${curlResponse.truncatedBody.split('\n').map(line => `  ${line}`).join('\n')}\n`);

    if (isTruncated) {
      logger.info(`  Body is truncated (${curlResponse.truncatedBodyLength} out of ${curlResponse.body.length})`);
    }
  }

  if (internalArgs.saveBody) {
    const storedBodyFile = await _TmpFile.default.create();
    await storedBodyFile.write(curlResponse.body);
    logger.info(`  Stored in ${storedBodyFile.path()}`);
  }

  if (!internalArgs.saveBody && !internalArgs.showBody) {
    logger.info(_chalk.default.yellow('  Disabled. To enable use EDGIO_CURL_SAVE_BODY=true or EDGIO_CURL_SHOW_BODY=true'));
  }

  logger.info('');
}

module.exports = exports.default;