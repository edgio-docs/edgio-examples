"use strict";

const {
  builder: deployBuilder
} = require('../commands/deploy');

module.exports = function useDeployOptions() {
  return deployBuilder;
};