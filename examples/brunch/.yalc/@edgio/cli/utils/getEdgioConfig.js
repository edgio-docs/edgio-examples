"use strict";

const slash = require('slash');

const getEdgioConfigFilePath = require('./getEdgioConfigFilePath');

module.exports = function getEdgioConfig() {
  const file = getEdgioConfigFilePath();

  if (file) {
    return require(slash(file));
  } else {
    return null;
  }
};