const createBuilder =
  require('@edgio/next/build/createBuildEntryPoint').default;
const { join } = require('path');
const srcDir = require('./nextSrcDir');

process.chdir(srcDir);
module.exports = createBuilder({
  srcDir,
  distDir: join('dist', 'apps', 'edgio-nx-next-app', '.next'),
  buildCommand: 'npm run build',
});
