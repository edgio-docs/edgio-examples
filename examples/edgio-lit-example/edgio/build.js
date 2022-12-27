const { exit } = require('process')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build(options) {
  try {
    builder.clearPreviousBuildOutput()
    builder.removeSync('build')
    let command = 'NODE_ENV=production npx rollup -c && npx tailwindcss -m -i ./src/app.css -o build/app.css'
    await builder.exec(command)
    await builder.build()
  } catch (e) {
    console.log(e)
    exit()
  }
}
