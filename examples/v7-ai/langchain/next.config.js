const { withEdgio } = require('@edgio/next/config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const _preEdgioExport = withBundleAnalyzer({})

module.exports = (phase, config) =>
  withEdgio({
    ..._preEdgioExport
  })