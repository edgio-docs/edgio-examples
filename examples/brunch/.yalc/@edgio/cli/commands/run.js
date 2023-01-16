"use strict";

const {
  join
} = require('path');

const {
  existsSync
} = require('fs');

const chalk = require('chalk');

const logo = require('../utils/logo');

const runDeploymentArchive = require('../utils/runDeploymentArchive');

const runWithServerless = require('../utils/runWithServerless');

const clearPorts = require('../utils/clearPorts');

const getEntryPoint = require('../utils/getEntryPoint');

const {
  isMonorepo,
  locateAppToRunCmd
} = require('../utils/monorepo');

exports.command = 'run [archive]';
exports.describe = 'Runs your project locally, simulating Edgio cloud environment. When no arguments are provided, this command is the same as edgio dev.';

exports.builder = yargs => yargs.option('production', {
  type: 'boolean',
  alias: 'p',
  describe: 'Runs your app in production mode, with caching enabled, emulating Edgio serverless runtime environment. You must first run edgio build to create a production build of your app.'
}).option('cache', {
  type: 'boolean',
  alias: 'c',
  describe: 'Enables caching in development mode. Caching is enabled by default in production mode.'
}).positional('archive', {
  describe: 'The path to a deployment archive (zip) file downloaded from Edgio Developer Console'
});

exports.handler = async ({
  context,
  production,
  archive,
  cache
}) => {
  await clearPorts();

  if (isMonorepo()) {
    await locateAppToRunCmd('run');
  }

  const edgioDir = join(process.cwd(), '.edgio');
  const {
    logger
  } = context;

  if (process.env.NODE_ENV === 'production') {
    production = true;
    cache = true;
  }

  if (archive) {
    logger.info(`> Running deployed app locally using ${logo}...`);
    await runDeploymentArchive(archive);
  } else if (production) {
    if (!existsSync(edgioDir)) {
      logger.error(`\nEdgio production build not found. Please run ${chalk.green('edgio build')} before running ${chalk.green('edgio run --production')}.\n`);
      process.exit(1);
    }

    logger.info(`> Running ${logo} in production mode...`); // Edgio automatically sets this as an environment variable on the Lambda in the cloud

    process.env.NODE_ENV = 'production';
    await runWithServerless(edgioDir);
  } else {
    logger.info(`> Starting ${logo} in development mode with caching ${cache ? chalk.green('enabled') : chalk.red('disabled')}...`);

    if (cache) {
      process.env.EDGIO_CACHE = 'true';
    }

    const dev = await getEntryPoint('dev');
    dev();
  }
};