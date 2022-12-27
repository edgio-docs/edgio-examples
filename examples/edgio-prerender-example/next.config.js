const { withEdgio, withServiceWorker } = require('@edgio/next/config')

module.exports = withEdgio(
  withServiceWorker({
    target: 'server',
    edgioSourceMaps: true,
  })
)
