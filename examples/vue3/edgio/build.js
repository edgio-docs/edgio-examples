const { join } = require('path')
const { exit } = require('process')
const { buildSync } = require('esbuild')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build(options) {
  try {
    builder.clearPreviousBuildOutput()
    let command = 'npx tailwindcss -i ./src/input.css -o ./src/compiled/output.css'
    await builder.exec(command)
    command = 'npx vue-cli-service build'
    await builder.exec(command)
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
    builder.addStaticAsset(join(appDir, 'dist'))
    await builder.build()
  } catch (e) {
    console.log(e)
    exit()
  }
}
