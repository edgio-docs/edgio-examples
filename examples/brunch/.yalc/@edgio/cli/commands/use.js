"use strict";

const EdgioPackageJson = require('../utils/EdgioPackageJson');

const logo = require('../utils/logo');

const {
  installDependencies
} = require('../utils/packageManager');

exports.command = 'use [edgioVersion]';
exports.describe = 'Updates Edgio version';
exports.builder = {
  edgioVersion: {
    type: 'string',
    describe: 'Updates Edgio version',
    demandOption: true
  },
  path: {
    type: 'string',
    describe: "Path to your site's root director. Uses current directory by default",
    default: '.'
  }
};

exports.handler = async ({
  context,
  edgioVersion,
  path: projectPath
}) => {
  const packageJson = new EdgioPackageJson(projectPath);
  await context.logger.step(`Updating ${logo}`, async () => {
    context.logger.info(`> Current: ${packageJson.findCurrentEdgioVersion()}`);
    context.logger.info(`> New: ${edgioVersion}`);
    const devDependencies = Object.fromEntries(packageJson.edgioDevDependencies().map(([name]) => [name, edgioVersion]));
    const runtimeDependencies = Object.fromEntries(packageJson.edgioRuntimeDependencies().map(([name]) => [name, edgioVersion]));
    await installDependencies(runtimeDependencies, {
      dev: false,
      overrideInstalled: true
    });
    await installDependencies(devDependencies, {
      dev: true,
      overrideInstalled: true
    });
  });
};