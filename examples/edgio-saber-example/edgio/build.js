const { exit } = require('process')
const { buildSync } = require('esbuild')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build(options) {
  try {
    builder.clearPreviousBuildOutput()
    let command = 'npx saber build'
    await builder.exec(command)
    buildSync({
      entryPoints: [`${appDir}/sw/service-worker.js`],
      outfile: `${appDir}/public/service-worker.js`,
      minify: true,
      bundle: true,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
        'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
      },
    })
    command = 'npx tailwindcss -m -i ./css/global.css -o public/app.css'
    await builder.exec(command)
    await builder.build()
  } catch (e) {
    console.log(e)
    exit()
  }
}
