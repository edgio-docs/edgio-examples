const esbuild = require('esbuild')
const { createDevServer } = require('@edgio/core/dev')

const appDir = process.cwd()

module.exports = function () {
  esbuild.build({
    entryPoints: [`${appDir}/sw/service-worker.js`],
    outfile: `${appDir}/dist/service-worker.js`,
    minify: true,
    bundle: true,
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
      'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
    },
  })
  return createDevServer({
    label: '[SolidJS]',
    command: (port) => `npx vite --port ${port}`,
    ready: [/localhost:/i],
  })
}
