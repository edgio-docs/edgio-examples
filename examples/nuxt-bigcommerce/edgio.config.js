'use strict';

// This file was automatically added by edgio deploy.
// You should commit this file to source control.

module.exports = {
  backends: {},
  includeNodeModules: true,
  connector: '@edgio/nuxt',
  server: {
    path: './dist/_edgio/server.js'
  },
  includeFiles: {
    'config/**': true,
    'api/**': true,
    'utils/**': true,
    '.env': true
  }
};
