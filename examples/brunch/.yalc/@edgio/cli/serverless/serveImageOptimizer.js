"use strict";

const {
  createServer
} = require('http');

const toLambdaEvent = require('./toLambdaEvent');

const processOptimizeRequest = require('../image-optimizer/processImageOptimizeRequest').processOptimizeRequest;
/**
 * Serves image optimizer
 * @param port
 */


module.exports = function serveImageOptimizer(port) {
  createServer(async (request, response) => {
    try {
      request.url = transformRequestUrl(request);

      if (!request.url) {
        response.writeHead(400, {
          'Content-type': 'text/plain'
        });
        response.end('Error: Invalid or none url parameter was provided.');
        return;
      } // We need to set logger for the image optimizer


      global.logger = {
        fatal: () => console.error,
        error: () => console.error,
        warn: () => console.warn,
        info: () => console.log,
        debug: () => console.debug,
        trace: () => console.log
      };
      const event = await toLambdaEvent(request);
      const res = await processOptimizeRequest(event);
      const {
        body,
        statusCode,
        statusMessage,
        multiValueHeaders
      } = res;

      for (let name in multiValueHeaders) {
        const value = multiValueHeaders[name]; // Node will handle arrays correctly (multiple values means multiple headers,
        // single value means single header) so we leave them unconverted.

        response.setHeader(name, value);
      }

      response.writeHead(statusCode, statusMessage);
      response.end(Buffer.from(body, res.isBase64Encoded ? 'base64' : 'utf8'));
    } catch (e) {
      response.writeHead(500, 'Internal Server Error');
      response.end('Error: Internal Server Error');
    }
  }).listen(port);
};
/**
 * Transforms request with relative path to absolute
 * @param request
 */


function transformRequestUrl(request) {
  const url = new URL(request.url, 'http://localhost');
  const protocol = request.secure ? 'https://' : 'http://';
  const urlParam = url.searchParams.get('url') || url.searchParams.get('img');
  if (!urlParam) return null;
  const imgUrl = new URL(urlParam, `${protocol}${request.headers.host}`).toString();
  url.searchParams.set('url', imgUrl);
  return `${url.pathname}?${url.searchParams.toString()}`;
}