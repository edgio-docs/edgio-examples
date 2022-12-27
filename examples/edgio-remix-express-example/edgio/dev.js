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
    label: '[Remix (Express)]',
    command: (port) => `npx remix build && npx tailwindcss -w -i ./styles/app.css -o app/styles/app.css & npx remix watch & NODE_ENV=development npx nodemon ./server.js --watch ./server.js --port ${port}`,
    ready: [/listening on/i],
  })
}
