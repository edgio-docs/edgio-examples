"use strict";

const {
  parse
} = require('querystring');

const readBody = require('./readBody');

const toMultiValueHeaders = require('./toMultiValueHeaders');
/**
 * Converts an IncomingMessage to an AWS lambda event.
 *
 * Note: there are different versions of this payload, see
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 *
 * The properties below don't match a specific version, but rather a blended set
 * that should be mostly compatible with both versions.
 * @param request
 */


module.exports = async function toLambdaEvent(request) {
  const [path, search] = request.url.split(/\?/);
  const query = parse(search);
  const body = await readBody(request);
  return {
    path,
    queryStringParameters: query,
    multiValueQueryStringParameters: query,
    httpMethod: request.method,
    isBase64Encoded: true,
    body: body.toString('base64'),
    multiValueHeaders: toMultiValueHeaders(request.headers)
  };
};