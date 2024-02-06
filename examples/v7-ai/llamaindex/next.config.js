const { withEdgio } = require('@edgio/next/config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
      mongodb$: false,
    };
    return config;
  },
  experimental: {
    outputFileTracingIncludes: {
      "/*": ["./cache/**/*"],
    },
  },
};

const _preEdgioExport = nextConfig;;

module.exports = (phase, config) =>
  withEdgio({
    typescript: {
      ignoreBuildErrors: true,
    },
    ..._preEdgioExport
  })
