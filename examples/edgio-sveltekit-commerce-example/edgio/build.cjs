const { join } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

module.exports = async () => {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npm run build')
  const appDir = process.cwd()
  builder.addJSAsset(join(appDir, '.vercel', 'output', 'functions', 'render.func'))
  await builder.build()
}
