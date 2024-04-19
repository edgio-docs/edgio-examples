// This file was automatically added by edgio init.
// You should commit this file to source control.
const { withEdgio } = require('@edgio/next/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
    ],
  },
};

const _preEdgioExport = nextConfig;

module.exports = (phase, config) =>
  withEdgio({
    ..._preEdgioExport,
  });
