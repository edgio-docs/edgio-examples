"use strict";

const {
  createServer
} = require('http');

const toLambdaEvent = require('./toLambdaEvent');
/**
 * Binds a serverless function to a port.
 * @param fn The serverless request handler function
 * @param port The port to bind to
 */


module.exports = function serveFunction(fn, port) {
  createServer(async (request, response) => {
    try {
      const event = await toLambdaEvent(request);
      const res = await fn(event);
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
      response.end(Buffer.from(body, 'base64'));
    } catch (e) {
      console.error(e); // We are emulating the XBP behavior on uncaught exceptions within user project code.

      response.writeHead(534, 'Project Unexpected Error');
    }
  }).listen(port);
};