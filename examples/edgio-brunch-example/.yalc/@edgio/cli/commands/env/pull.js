"use strict";

const {
  EOL
} = require('os');

const path = require('path');

const fse = require('fs-extra');

const {
  confirmOrExit
} = require('../../utils/prompts');

const authenticate = require('../../prompts/authenticate');

const EdgioPackageJson = require('../../utils/EdgioPackageJson');

const getEdgioConfig = require('../../utils/getEdgioConfig');

const Validator = require('../../utils/validator');

exports.command = 'pull <path-to-env-file>';
exports.describe = 'Copy non-secret environment variables from an environment to a local .env file';
exports.builder = {
  site: {
    type: 'string',
    alias: 's',
    describe: 'Slug of the site to pull variables from. Using package.json name property if omitted.'
  },
  team: {
    type: 'string',
    alias: 't',
    describe: 'The name of the team under which the site belongs. Using private space if omitted.'
  },
  environment: {
    type: 'string',
    alias: 'e',
    describe: 'Environment to pull variables from. Uses default environment if omitted.',
    default: 'default'
  },
  path: {
    type: 'string',
    describe: "Path to your site's root directory. Uses current directory by default.",
    default: '.'
  }
};

exports.handler = async yargs => {
  const {
    context,
    pathToEnvFile,
    site: siteSlugParam,
    team: teamSlugParam,
    environment: environmentParam,
    path: pathParam
  } = yargs;
  const absolutePathToEnvFile = path.resolve(process.cwd(), pathToEnvFile);
  await authenticate(context);

  if (fse.existsSync(absolutePathToEnvFile)) {
    context.logger.warn(`File ${absolutePathToEnvFile} already exists and will be overwritten`);
    await confirmOrExit('Do you want to continue?', {
      initial: false
    });
  }

  const config = getEdgioConfig();

  if (!config) {
    context.logger.error(`Error: edgio.config.js not found. Please run "edgio init" to initialize your Edgio project.\n`);
    process.exit(1);
  }

  const validator = new Validator(context.logger, {
    exitOnError: true
  });
  const packageJson = EdgioPackageJson.loadPackageJson(pathParam);
  const siteSlug = validator.validateSiteName(siteSlugParam || config.name || packageJson.name);
  context.logger.title(EOL + '📋 Pulling environment variables from:');
  const environmentDetails = [`> team=${teamSlugParam || 'Private space'}`, `> site=${siteSlug}`, `> environment=${environmentParam}`].filter(Boolean); // Removes falsy values

  context.logger.info(environmentDetails.join(EOL));
  context.logger.title(`${EOL}Into file: ${absolutePathToEnvFile}`);
  const environmentVariables = await context.api.getEnvironmentVariables({
    siteSlug,
    teamSlug: teamSlugParam,
    environment: environmentParam
  });
  let fileContent = '# Environments variables pulled from:' + EOL + environmentDetails.map(detail => `# ${detail}`).join(EOL) + EOL + EOL;

  for (const {
    key,
    secret,
    value
  } of environmentVariables) {
    if (secret) {
      context.logger.warn(`Warning: Environment variable "${key}" has a secret value. You will need to edit it manually.`);
      fileContent += '# This value is a secret and needs to be edited manually' + EOL;
    }

    fileContent += (secret ? `#${key}=<SECRET VALUE>` : `${key}=${value}`) + EOL + EOL;
  }

  await fse.writeFile(absolutePathToEnvFile, fileContent);
};