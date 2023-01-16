"use strict";

const {
  writeFileSync
} = require('fs');

const {
  join
} = require('path');

const {
  DEPLOYMENT_MANIFEST_FILE
} = require('../constants');
/**
 * Writes information about the deployment to .edgio/deployment-manifest.json. This allows
 * the CI environment to determine what was deployed, for example, to run integration tests
 * against the new deployment.
 *
 * For context, see
 *
 * @param {String} appDir The path to the app that was deployed
 * @param {Object} build An object containing information about the deployment
 */


module.exports = function writeDeploymentManifest(appDir, build) {
  const dest = join(appDir, '.edgio', DEPLOYMENT_MANIFEST_FILE); // Note: I realize I could just write the build objeect verbatim and that I'm not even changing the names
  // of any fields here, but I think it's better to be strict about exactly what is written because it
  // becomes part of the public contract documented here: https://docs.edg.io/guides/cli#section_deploy

  const manifest = {
    number: build.number,
    url: build.url,
    environment: {
      url: build.environment.activeUrls[0],
      name: build.environment.name
    }
  };
  writeFileSync(dest, JSON.stringify(manifest), 'utf8');
};