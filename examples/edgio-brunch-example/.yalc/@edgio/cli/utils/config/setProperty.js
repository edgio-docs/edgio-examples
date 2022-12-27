"use strict";

const formatSource = require('./formatSource');
/**
 * Sets the specified property, returning the updated source code.
 *
 * Note that this function is far from perfect. It assumes that property names are unique in the source code and that
 * the correct object to which the property should be added can be found by matching a single line pattern.
 *
 * Why do we use this instead of jscodeshift? Because jscodeshift randomly reorders any existing comments.
 *
 * @param {string} source The source code to modify
 * @param {string} name The name of the property to set
 * @param {string} value The value to set
 * @param {*} options
 * @param {*} options.after Only search for a line to replace after matching this line. If the property is not found, it will
 *  be added directly after this line.
 * @returns Updated source code
 */


module.exports = function setProperty(source, name, value, {
  after
} = {}) {
  let lines = source.split(/\n/);
  let startReplacing = after == null;
  let afterLine;
  let success = false;
  const pattern = new RegExp(`(//\\s*)?${name}\\s*:\\s*["'][^"']*["']`);
  const property = `${name}: '${value}'`;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (startReplacing && pattern.test(line)) {
      lines[i] = line.replace(pattern, property);
      success = true;
      break;
    } else if (after && after.test(line)) {
      startReplacing = true;
      afterLine = i;
    }
  }

  if (!success && afterLine != null) {
    success = true;
    lines.splice(afterLine + 1, 0, property + ',');
  }

  if (success) {
    return formatSource(lines.join('\n'));
  } else {
    throw new Error(`The ${name} property could not be found.`);
  }
};