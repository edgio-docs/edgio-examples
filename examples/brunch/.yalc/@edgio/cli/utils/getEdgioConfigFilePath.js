"use strict";

const {
  join
} = require('path');

const {
  existsSync
} = require('fs');

module.exports = function getEdgioConfigFilePath() {
  return [join(process.cwd(), 'edgio.config.js'), join(process.cwd(), 'edgio.config.cjs')].find(existsSync);
};