"use strict";

const EdgioPackageJson = require('../../utils/EdgioPackageJson');

const authenticate = require('../../prompts/authenticate');

const getEdgioConfig = require('../../utils/getEdgioConfig');

const getSite = require('../../utils/getSite');

const {
  EOL
} = require('os');

const {
  green
} = require('chalk');

const Validator = require('../../utils/validator');

exports.command = 'del'; // This command is hidden until console team will be ready to support it
// exports.describe = 'Deletes the environment with given name'

exports.builder = {
  environment: {
    type: 'string',
    alias: 'e',
    describe: 'Name of the environment.',
    demandOption: true
  },
  site: {
    type: 'string',
    alias: 's',
    describe: 'Slug of the site. Using package.json name property if omitted.'
  },
  team: {
    type: 'string',
    alias: 't',
    describe: 'The name of the team under which the site belongs. Using private space if omitted.'
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
    environment: environmentParam,
    site: siteSlugParam,
    team: teamSlugParam,
    path: pathParam
  } = yargs;
  await authenticate(context);
  const config = getEdgioConfig();

  if (!config) {
    context.logger.error(`Error: edgio.config.js not found. Please run "0 init" to initialize your Edgio project.\n`);
    process.exit(1);
  }

  const validator = new Validator(context.logger, {
    exitOnError: true
  });
  const packageJson = EdgioPackageJson.loadPackageJson(pathParam);
  const siteSlug = validator.validateSiteName(siteSlugParam || config.name || packageJson.name);
  context.logger.warn('WARNING: Experimental feature - compatibility and support is not guaranteed (APPOPS-15456).');
  await context.logger.title('⌛ Deleting environment...');
  const environmentDetails = [`> team=${teamSlugParam || 'Private space'}`, `> site=${siteSlug}`, `> environment=${environmentParam}`].filter(Boolean); // Removes falsy values

  context.logger.info(environmentDetails.join(EOL));
  let site = await getSite(context, siteSlug, teamSlugParam);
  let environments = site.environments.nodes;
  const environmentToDelete = environments.find(environment => environment.name === environmentParam);

  if (!environmentToDelete) {
    context.logger.error(`Error: Environment "${environmentParam}" was not found.`);
    process.exit(1);
  }

  const deleteResult = await context.api.deleteEnvironment(environmentToDelete.id);

  if (deleteResult.deleteEnvironment) {
    context.logger.info(green(`Environment "${environmentParam}" was successfully deleted.`));
    process.exit(0);
  }

  context.logger.error(`Error: Couldn't delete the environment "${environmentParam}"`);
  process.exit(1);
};