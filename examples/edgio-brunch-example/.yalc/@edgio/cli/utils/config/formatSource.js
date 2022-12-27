"use strict";

const prettier = require('prettier');

const getEdgioConfigFilePath = require('../getEdgioConfigFilePath');
/**
 * Returns a prettier formatted version of the supplied source.
 */


module.exports = function formatSource(source, {
  filepath = getEdgioConfigFilePath()
} = {}) {
  return prettier.format(source, {
    filepath
  });
};