"use strict";

const authenticate = require('../prompts/authenticate');

const chalk = require('chalk');

exports.command = 'ls';
exports.describe = 'Lists all teams, sites and environments';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await authenticate(context);
  const data = await context.api.getTeamsSitesEnvs();

  const colorizedOutput = (color, name, info) => `${chalk.bold.keyword(color)(name)} (${chalk.dim.white(info)})`;

  data.nodes.forEach(team => {
    console.log(colorizedOutput('aqua', team.slug, 'team'));
    team.sites.nodes.forEach(site => {
      console.log(`   ${colorizedOutput('lime', site.slug, 'site')}`);
      site.environments.nodes.forEach(env => console.log(`      ${colorizedOutput('orange', env.name, 'environment')}`));
    });
  });
};