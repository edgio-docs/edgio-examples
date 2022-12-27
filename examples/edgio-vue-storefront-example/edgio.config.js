// This file was automatically added by layer0 deploy.
// You should commit this file to source control.
module.exports = {
  routes: './layer0/routes.js',
  backends: {
    origin: {
      domainOrIp: 'demo.vuestorefront.io',
      hostHeader: 'demo.vuestorefront.io'
    }
  },
  connector: './layer0',
  includeNodeModules: true,
  includeFiles: {
    './dist-layer0-server/server.js': true,
    './dist': true,
    './config/default.json': 'config/production.json'
  }
}
