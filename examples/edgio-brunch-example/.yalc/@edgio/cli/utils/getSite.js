"use strict";

module.exports = async function getSite(context, siteSlug, teamSlug = null) {
  var _await$context$api$ge;

  // Get personal team slug if no teamSlug is provided
  teamSlug = teamSlug ?? ((_await$context$api$ge = await context.api.getPersonalTeam()) === null || _await$context$api$ge === void 0 ? void 0 : _await$context$api$ge.slug);
  let teams = await context.api.getTeamsSitesEnvs();

  if (!teams || teams.nodes.length === 0) {
    context.logger.error(`Error: Couldn't fetch the teams.`);
    process.exit(1);
  }

  let team = teams.nodes.find(team => team.slug === teamSlug);

  if (!team) {
    context.logger.error(`Error: Couldn't find team ${teamSlug}`);
    process.exit(1);
  }

  let sites = team.sites.nodes;
  let selectedSite = sites.find(site => site.slug === siteSlug);

  if (!selectedSite) {
    context.logger.error(`Error: Site with this name was not found in team ${teamSlug}.`);
    process.exit(1);
  }

  return selectedSite;
};