"use strict";

const {
  getNodePackageInfo
} = require('../utils/packageManager');

const EdgioPackageJson = require('../utils/EdgioPackageJson');

const semver = require('semver');

const chalk = require('chalk');

const terminalLink = require('terminal-link');

const {
  getLastVersionCheck,
  setLastVersionCheck
} = require('../utils/config');

const CHANGELOG_URL = 'https://docs.edg.io/guides/changelog';
const CHECK_AFTER_EVERY = 1000 * 60 * 60 * 24 * 1; // 1 day

module.exports = async ({
  context,
  path: projectPath
}) => {
  const {
    logger
  } = context;

  try {
    const lastCheckAt = getLastVersionCheck();

    if (lastCheckAt && lastCheckAt >= Date.now() - CHECK_AFTER_EVERY) {
      return;
    }

    const packageJson = new EdgioPackageJson(projectPath);
    const currentVersionRange = packageJson.findCurrentEdgioVersion();
    const cmdOutput = await getNodePackageInfo('@edgio/cli');
    const pckInfo = JSON.parse(cmdOutput.join(''));
    const latestVersion = pckInfo.data['dist-tags'].latest;
    const currentVersion = semver.coerce(currentVersionRange).version;
    const hasNewVersion = semver.lt(currentVersion, latestVersion);

    if (hasNewVersion) {
      logger.warn('⚠️', ` A new version of Edgio is available: ${chalk.green(`v${latestVersion}`)}.`);
      logger.warn(`Run "${chalk.green('edgio use latest')}" to upgrade your app.`);
      logger.warn(`For more information, see ${terminalLink.isSupported ? `the ${chalk.green(terminalLink('changelog', CHANGELOG_URL))}` : chalk.green(CHANGELOG_URL)}.`);
      logger.warn('');
    }
  } catch (e) {// Should we log something? it shouldn't interupt the build process,
    // so leaving a noop here and might be confusing while showing that error for user, might just ignore it.
  } finally {
    setLastVersionCheck(Date.now());
  }
};