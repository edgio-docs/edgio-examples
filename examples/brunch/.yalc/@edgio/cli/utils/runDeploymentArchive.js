"use strict";

const {
  join
} = require('path');

const unzip = require('./unzip');

const runWithServerless = require('./runWithServerless');

const {
  installDependencies
} = require('./packageManager');

const {
  readFileSync,
  writeFileSync,
  existsSync
} = require('fs');

const semver = require('semver');
/**
 * Use this function to run a deployment bundle (zip file) downloaded from app.edgio.co.
 * @param filePath The path to the deployment bundle
 */


module.exports = async function runDeploymentArchive(filePath) {
  const dest = join(process.cwd(), filePath).replace('.zip', '');
  const edgioDir = join(dest, '.edgio');

  if (!existsSync(edgioDir)) {
    await unzip(filePath, edgioDir);
  }

  await ensureEdgioCoreInstalled(edgioDir);
  await runWithServerless(edgioDir);
};
/**
 * Since we exclude some heavyweight dependencies such as cls-hooked from the application when
 * bundling for serverless, and those packages are needed to run the app bundle locally, we ensure that
 * the correct version of the core and its dependencies are installed in the exploded app bundle before,
 * otherwise we would get errors about packages node being found.
 */


async function ensureEdgioCoreInstalled(edgioDir) {
  let cwd = process.cwd();

  try {
    process.chdir(edgioDir);

    if (!existsSync(join('node_modules', '@layer0', 'core')) && !existsSync(join('node_modules', '@edgio', 'core'))) {
      const edgioVersion = existsSync('EDGIO_VERSION') ? // We are removing any whitespace characters to make loading more robust
      readFileSync('EDGIO_VERSION', 'utf8').replace(/\s/g, '') : readFileSync('LAYER0_VERSION', 'utf8').replace(/\s/g, '');
      writeFileSync('package.json', '{}', 'utf-8');

      if (semver.satisfies(semver.valid(semver.coerce(edgioVersion)), '<5.0.0')) {
        await installDependencies({
          '@layer0/core': edgioVersion
        }, {
          quiet: false
        });
      } else {
        await installDependencies({
          '@edgio/core': edgioVersion
        }, {
          quiet: false
        });
      }
    }
  } finally {
    process.chdir(cwd);
  }
}