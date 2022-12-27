const {join} = require('path');
const {exit} = require('process');
const {nodeFileTrace} = require('@vercel/nft');
const {DeploymentBuilder} = require('@edgio/core/deploy');
const {isYarn} = require('@edgio/cli/utils/packageManager');

const appDir = process.cwd();
const builder = new DeploymentBuilder(appDir);

module.exports = async function build(options) {
  try {
    builder.clearPreviousBuildOutput();
    let command = 'npm run build -- --target node';
    if (isYarn()) {
      command = 'yarn build --target node'
    }
    await builder.exec(command);
    builder.addJSAsset(join(appDir, 'dist'));
    builder.addJSAsset(join(appDir, 'server.js'));
    // Determine the node_modules to include
    let dictNodeModules = await getNodeModules();
    Object.keys(dictNodeModules).forEach(async (i) => {
      await builder.addJSAsset(`${appDir}/${i}`);
    });
    await builder.build();
  } catch (e) {
    console.log(e);
    exit();
  }
};

async function getNodeModules() {
  // The whole app inside index.js
  const files = ['./dist/node/index.js'];
  // Compute file trace
  const {fileList} = await nodeFileTrace(files);
  // Store set of packages
  let packages = {};
  fileList.forEach((i) => {
    if (i.includes('node_modules/')) {
      let temp = i.replace('node_modules/', '');
      temp = temp.substring(0, temp.indexOf('/'));
      packages[`node_modules/${temp}`] = true;
    } else {
      packages[i] = true;
    }
  });
  // Sort the set of packages
  return Object.keys(packages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = packages[key];
      return obj;
    }, {});
}
