"use strict";

/**
 * Intercepts and copy all the data written to the 'streamsToObserve' into a string variable
 * which value can be retrieved via the returned object's getOutput() function
 *
 * @param {Stream} streamToObserve
 * @return {object} exposes getOutput() to retrieve the written value and detach() to stop
 *                  to stop intercepting data
 *
 */
module.exports = function stdStreamsObserver(streamsToObserve) {
  let output = '';
  const detachFunctions = streamsToObserve.map(stream => {
    const originalWrite = stream.write;

    stream.write = (...args) => {
      let chunk = args[0];

      if (chunk) {
        // When not a string it's usually a Buffer or Uint8Array, which we convert to String
        if (typeof chunk !== 'string') {
          chunk = Buffer.from(chunk).toString();
        }

        output += chunk;
      }

      originalWrite.apply(stream, args);
    };

    return function detach() {
      stream.write = originalWrite;
    };
  });
  return {
    detach: () => detachFunctions.forEach(detach => detach()),
    getOutput: () => output
  };
};