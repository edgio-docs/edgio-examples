"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padCenter = padCenter;
exports.padEnd = padEnd;

/**
 * Examples:
 *
 * padCenter('foo', 9) => "   foo   "
 * padCenter('bar', 5) => " bar "
 */
function padCenter(input, padding) {
  const inputString = input.toString();
  return padEnd(inputString.padStart((inputString.length + padding) / 2), padding);
}
/**
 * Examples:
 *
 * padEnd('foo', 9) => "      foo"
 * padEnd('bar', 5) => "  bar"
 */


function padEnd(input, padding) {
  const inputString = input.toString();
  return inputString.padEnd(padding);
}