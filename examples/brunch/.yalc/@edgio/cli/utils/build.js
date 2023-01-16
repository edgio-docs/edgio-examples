"use strict";

const logo = require('./logo');

const getEntryPoint = require('./getEntryPoint');

const chalk = require('chalk');

const {
  isMonorepo,
  locateAppToRunCmd
} = require('./monorepo');

module.exports = async function build({
  context,
  skipFramework,
  disablePermanentAssets,
  includeSources
}) {
  if (isMonorepo()) {
    await locateAppToRunCmd('build');
  }

  process.env.NODE_ENV = 'production';
  const {
    logger
  } = context;

  if (includeSources) {
    process.env.EDGIO_INCLUDE_SOURCES = 'true'; // see DeploymentBuilder#build
  }

  if (disablePermanentAssets) {
    console.log(`> Edgio permanent asset storage is ${chalk.red('disabled')}.`);
    process.env.EDGIO_DISABLE_PERMANENT_ASSETS = 'true'; // see DeploymentBuilder#addStaticAsset
  }

  await logger.step(`🛠️  Building your app for deployment on ${logo}`, async () => {
    const build = await getEntryPoint('build');
    await build({
      skipFramework
    });
  });
};