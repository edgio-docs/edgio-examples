"use strict";

const runHandler = require('./run').handler;

exports.command = 'dev';
exports.describe = 'Runs your project in development mode, simulating Edgio cloud environment. This command is a simplified version of edgio run, with only the --cache option being supported.';

exports.builder = yargs => yargs.option('cache', {
  type: 'boolean',
  alias: 'c',
  describe: 'Enables caching.'
});

exports.handler = function dev({
  context,
  cache
}) {
  return runHandler({
    context,
    cache
  });
};