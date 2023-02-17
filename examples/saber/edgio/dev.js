const { build } = require('esbuild')
const { createDevServer } = require('@edgio/core/dev')
const appDir = process.cwd()

module.exports = function () {
  build({
    entryPoints: [`${appDir}/sw/service-worker.js`],
    outfile: `${appDir}/public/service-worker.js`,
    minify: true,
    bundle: true,
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.EDGIO_PREFETCH_HEADER_VALUE': '"1"',
      'process.env.EDGIO_PREFETCH_CACHE_NAME': '"prefetch"',
    },
  })
  return createDevServer({
    label: '[Saber]',
    command: (port) => `npx saber -- --port ${port} & npx tailwindcss -w -i ./css/global.css -o public/app.css`,
    ready: [/localhost:/i],
  })
}
