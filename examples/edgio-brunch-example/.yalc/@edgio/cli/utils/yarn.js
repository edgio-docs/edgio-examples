"use strict";

const execa = require('execa');

const path = require('path');

const yarnPath = path.join(__dirname, '../node_modules/yarn/bin/yarn');
/**
 * Unfortunately `yarn` does not have a programmatic API
 * so we have to use the CLI.
 */

exports.install = async (projectDir, {
  pipe = false
} = {}) => {
  try {
    const subprocess = execa(yarnPath, ['install'], {
      cwd: projectDir,
      all: true
    });
    if (pipe) subprocess.all.pipe(process.stdout);
    const {
      all
    } = await subprocess;
    return all;
  } catch (err) {
    throw new Error(`Failed to run yarn: ${err.message}\n${err.all}`);
  }
};