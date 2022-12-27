const { withEdgio, withServiceWorker } = require('@edgio/next/config')

const nextConfig = {
  output: 'standalone',
}

module.exports = withEdgio(
  withServiceWorker({
    edgioSourceMaps: true,
    ...nextConfig,
  })
)
