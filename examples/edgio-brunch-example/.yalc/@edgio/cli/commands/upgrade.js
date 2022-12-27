"use strict";

const upgrade = require('../utils/upgrade');

exports.command = 'upgrade [edgioVersion]';
exports.describe = 'Upgrades a Layer0 site to Edgio';
exports.builder = {
  edgioVersion: {
    type: 'string',
    describe: 'Updates Edgio version',
    default: 'latest'
  },
  path: {
    type: 'string',
    describe: "Path to your site's root director. Uses current directory by default",
    default: '.'
  },
  ignoreDirty: {
    type: 'boolean',
    describe: 'Continue the upgrade even if the working branch has uncommitted changes',
    default: false
  },
  nonInteractive: {
    type: 'boolean',
    describe: 'Upgrades in non-interactive mode, ignoring prompts to confirm changes',
    default: false
  }
};
exports.handler = upgrade;