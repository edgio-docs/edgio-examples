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

exports.command = 'set-production'; // This command is hidden until console team will be ready to support it
// exports.describe = 'Changes the production environment'

exports.builder = {
  environment: {
    type: 'string',
    alias: 'e',
    describe: 'The name of the environment.',
    demandOption: true
  },
  site: {
    type: 'string',
    alias: 's',
    describe: 'Slug of the site. Using package.json environment property if omitted.'
  },
  team: {
    type: 'string',
    alias: 't',
    describe: 'The environment of the team under which the site belongs. Using private space if omitted.'
  },
  path: {
    type: 'string',
    describe: "Path to your site's root directory. Uses current directory by default.",
    default: '.'
  }
};

exports.handler = async yargs => {
  var _setResult$setProduct;

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
  await context.logger.title('⌛ Changing production environment...');
  const environmentDetails = [`> team=${teamSlugParam || 'Private space'}`, `> site=${siteSlug}`, `> environment=${environmentParam}`].filter(Boolean); // Removes falsy values

  context.logger.info(environmentDetails.join(EOL));
  let site = await getSite(context, siteSlug, teamSlugParam);
  let environments = site.environments.nodes;
  const environmentToChange = environments.find(environment => environment.name === environmentParam);

  if (!environmentToChange) {
    context.logger.error(`Error: Environment "${environmentParam}" was not found.`);
    process.exit(1);
  }

  if (environmentToChange.production) {
    context.logger.error(`Error: Nothing to change. The environment "${environmentParam}" is production environment.`);
    process.exit(1);
  }

  const setResult = await context.api.setProductionEnvironment(environmentToChange.id);
  const errors = (_setResult$setProduct = setResult.setProductionEnvironment) === null || _setResult$setProduct === void 0 ? void 0 : _setResult$setProduct.userErrors;

  if (errors && errors.length === 0) {
    context.logger.info(green(`Production environment was successfully changed to "${environmentParam}"`));
    process.exit(0);
  }

  if (errors && errors.length > 0) {
    errors.forEach(error => {
      context.logger.error(`Error: ${error.message}.`);
    });
    process.exit(1);
  }

  context.logger.error(`Error: Unknown error. Couldn't change production environment to "${environmentParam}".`);
  process.exit(1);
};