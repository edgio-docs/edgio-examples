"use strict";

/**
 * Converts node headers to the multi-value headers format that lambda expects.
 * @param headers Node request headers
 */
module.exports = function toMultiValueHeaders(headers) {
  const multiValueHeaders = {};

  for (let name in headers) {
    const value = headers[name]; // All values in multiValueHeaders must be arrays.

    if (!Array.isArray(value)) {
      multiValueHeaders[name] = [value];
    } else {
      multiValueHeaders[name] = value;
    }
  }

  return multiValueHeaders;
};