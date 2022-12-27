// This file was automatically added by edgio init.
// You should commit this file to source control.
const { withEdgio, withServiceWorker } = require('@edgio/next/config')

const config = withEdgio(
  withServiceWorker({
    // Output sourcemaps so that stacktraces have original source filenames and line numbers when tailing
    // the logs in the Edgio developer console.
    edgioSourceMaps: true,
  })
)

module.exports = config
