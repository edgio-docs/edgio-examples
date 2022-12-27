const appDir = process.cwd()
const { buildSync } = require('esbuild')

buildSync({
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

buildSync({
  entryPoints: [`${appDir}/sw/install-service-worker.js`],
  outfile: `${appDir}/dist/install-service-worker.js`,
  minify: true,
  bundle: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
    'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
  },
})
