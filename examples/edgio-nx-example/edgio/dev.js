const next = require('next');
const createDevServer = require('@edgio/core/dev/createDevServer').default;
const srcDir = require('./nextSrcDir');
const cwd = process.cwd();

module.exports = async function dev() {
  process.chdir(srcDir);
  global.LAYER0_NEXT_APP = next({ dev: true });
  process.chdir(cwd);

  return createDevServer({
    label: 'Next',
    command: (port) => `npx nx run edgio-nx-next-app:serve -- --port=${port}`,
    ready: [/on http:\/\/localhost:3001/i],
  });
};
