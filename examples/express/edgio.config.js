// This file was automatically added by edgio init.
// You should commit this file to source control.

const { join } = require('path')

// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: '@edgio/express',
  express: {
    // Uncomment the line below to specify the path to the app:
    appPath: join(process.cwd(), 'app.js'),
    // Uncomment the line below to bundle your express app using @vercel/nft to reduce the bundle size and cold start times
    // nft (Node file trace) produces an exploded, tree-shaken bundle with a node_modules directory containing only those modules
    // used by your app.
    bundler: '@vercel/nft',
  },
}
