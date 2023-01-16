"use strict";

const build = require('../utils/build');

exports.command = 'build';
exports.describe = 'Builds your project for deployment on edgio.';
exports.builder = {
  skipFramework: {
    type: 'boolean',
    alias: 's',
    describe: 'Skips running the framework build (Next.js, Vue, Angular, etc...) and uses the existing build instead.'
  },
  includeSources: {
    type: 'boolean',
    describe: 'Includes source files in the bundle uploaded to edgio for debugging purposes based on the sources config in edgio.config.js.'
  },
  disablePermanentAssets: {
    type: 'boolean',
    describe: 'Set this to true to suppress errors like "Immutable file (...) content was changed"'
  }
};

exports.handler = async yargs => {
  await build(yargs);
};