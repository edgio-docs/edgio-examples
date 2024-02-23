// This file was automatically added by edgio init.
// You should commit this file to source control.
const { withEdgio } = require('@edgio/next/config')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/commerce/:name',
        destination: '/commerce',
      },
    ]
  },
  images: {
    domains: ['edgio-community-ecommerce-api-example-default.layer0-limelight.link'],
  },
}

module.exports = (phase, config) =>
  withEdgio({
    ...nextConfig,
  })
