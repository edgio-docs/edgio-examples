"use strict";

const terminalLink = require('terminal-link');

const EdgioPackageJson = require('../EdgioPackageJson');

const logo = require('../logo');

const use = require('../../commands/use').handler;

const layer0Upgrade = require('./layer0');

module.exports = async function upgrade(args) {
  const {
    context,
    edgioVersion,
    path: projectPath
  } = args;
  const {
    logger
  } = context;
  const packageJson = new EdgioPackageJson(projectPath);
  const version = getVersion(packageJson);

  if (version.edgio) {
    // just upgrade the version
    await logger.step(`Found existing Edgio project. Updating from '${version.edgio}' to '${edgioVersion}'.`, async () => await use(args));
    return;
  } else if (version.layer0) {
    await logger.step(`Found existing Layer0 project. Migrating from '${version.layer0}' to '${edgioVersion}'.`, async () => {
      await layer0Upgrade(args);
      logger.success(`\n\n🚀 Migration from Layer0 to ${logo} completed successfully.`);
      logger.warn(`\n`, `Please note that some project dependencies and files have been altered in this upgrade.`, `It is highly recommended you verify the changes prior to committing and deployment.`, `For additional reference, visit the ${terminalLink('Edgio v5 Migration guide', 'https://docs.edg.io/guides/reference/v5_migration')}.`);
    });
  } else {
    context.logger.error(`Please run 'edgio init' to initalize this project.`);
    return;
  }
};

function getVersion(pkg) {
  const layer0 = pkg.find(['devDependencies', '@layer0/core'], undefined);
  const edgio = pkg.find(['devDependencies', '@edgio/core'], undefined);
  return {
    edgio,
    layer0
  };
}