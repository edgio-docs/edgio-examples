const { join } = require('path')
const { nodeFileTrace } = require('@vercel/nft')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()

module.exports = async () => {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npm run build')
  await builder.build()
  const { fileList } = await nodeFileTrace([join(appDir, 'dist', 'index.mjs')])
  Array.from(fileList).forEach((file) => builder.copySync(file, join(builder.jsDir, file)))
  builder.removeSync(join(builder.jsDir, 'package.json'))
  builder.writeFileSync(join(builder.jsDir, '__backends__', 'package.json'), JSON.stringify({ type: 'commonjs' }))
  builder.writeFileSync(join(builder.jsDir, 'dist', 'package.json'), JSON.stringify({ type: 'module' }))
}
