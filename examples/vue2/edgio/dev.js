const { build } = require('esbuild')
const { createDevServer } = require('@edgio/core/dev')

const appDir = process.cwd()

module.exports = function () {
  build({
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
    label: '[Vue 2.0]',
    command: (port) => `PORT=${port} npx vue-cli-service serve & npx tailwindcss -i ./src/input.css -o ./src/compiled/output.css --watch`,
    ready: [/localhost:/i],
    filterOutput: (line) => !(line.includes('192.168') || line.includes('localhost')),
  })
}
