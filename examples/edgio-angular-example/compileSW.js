const appDir = process.cwd()
const esbuild = require('esbuild')

esbuild.buildSync({
  entryPoints: [`${appDir}/sw/service-worker.js`],
  outfile: `${appDir}/sw/bundled-service-worker.js`,
  minify: true,
  bundle: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.EDGIO_PREFETCH_HEADER_VALUE': '"1"',
    'process.env.EDGIO_PREFETCH_CACHE_NAME': '"prefetch"',
  },
})
