"use strict";

const chalk = require('chalk');
/**
 * Outputs colored text that uses the Edgio brand gradient.
 * When aligning text, keep in mind that colored string,
 * has a different .length that it has characters.
 * @param text The text to colorize
 * @returns
 */


module.exports = function brandify(text) {
  const colors = [chalk.hex('812291'), chalk.hex('3863A2'), chalk.hex('208F96'), chalk.hex('1F9C86'), chalk.hex('1EAA72')];
  return chalk.bold(Array.from(text).map((char, i) => colors[i % colors.length](char)).join(''));
};