"use strict";

/**
 * Asynchronously reads the body of the give request or response object
 * and returns it through a promise yielding Buffer object.
 *
 * @param {IncomingMessage} reqOrRes Node's IncomingMessage object
 * @returns Promise<Buffer>
 */
module.exports = function readBody(reqOrRes) {
  return new Promise((resolve, reject) => {
    const data = [];
    reqOrRes.on('data', chunk => data.push(chunk));
    reqOrRes.on('end', () => resolve(Buffer.concat(data)));
    reqOrRes.on('error', reject);
  });
};