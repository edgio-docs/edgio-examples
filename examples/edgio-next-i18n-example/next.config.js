// // This file was automatically added by edgio init.
// // You should commit this file to source control.
const { withEdgio, withServiceWorker } = require('@edgio/next/config')
const { i18n } = require('./i18next.config');

module.exports = withEdgio(
  withServiceWorker({
    // Output sourcemaps so that stacktraces have original source filenames and line numbers when tailing
    // the logs in the Edgio developer console.
    edgioSourceMaps: true,
    i18n
  })
)
