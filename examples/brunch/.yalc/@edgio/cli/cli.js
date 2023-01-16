#!/usr/bin/env node
// Note that this file is usually invoked through cli-local, which loads the CLI from
// local node_modules if present.
// But, when developing on the CLI specifically, we can run this file directly.
"use strict";

const {
  EOL
} = require('os');

const latestVersionWarning = require('./prompts/latestVersionWarning');

const yargs = require('yargs');

const chalk = require('chalk');

const Context = require('./utils/context');

const isCI = require('is-ci');

const initContext = async argv => ({
  context: new Context(argv)
});

yargs.scriptName('edg').middleware(initContext).commandDir('commands').command({
  command: 'curl',
  describe: 'edgio curl client. Refer to "0 curl --help" for documentation'
}).option('api-url', {
  type: 'string',
  description: 'edgio Developer Console URL',
  // TODO: Change the domain - APPOPS-15850 We are unable to change the domain of API at the moment.
  default: 'https://api.layer0.co'
}).options('token', {
  type: 'string',
  description: 'Authenticate with a specific site deploy token. You can also specify the token by setting the EDGIO_DEPLOY_TOKEN environment variable.'
}).option('verbose', {
  alias: 'v',
  type: 'boolean',
  description: 'Run with verbose logging'
}).option('local', {
  type: 'boolean',
  hidden: true
}).option('dev', {
  type: 'boolean',
  hidden: true
}).option('stage', {
  type: 'boolean',
  hidden: true
}).options('ignore-error', {
  type: 'string',
  hidden: true
}).options('non-interactive', {
  alias: 'ni',
  type: 'boolean',
  description: 'Runs the command without user interaction. Default to false, except when a known CI env variable is detected',
  default: isCI
}).options('use-global', {
  alias: 'g',
  type: 'boolean',
  description: 'Force using the globally-installed CLI version over the version local to the project.'
}).strict().completion('completion', 'Generates a script that you can add to your shell to enable autocompletions for the edgio command').demandCommand().middleware([latestVersionWarning]).fail((msg, err, yargs) => {
  try {
    if (err) {
      if (err.isUserError) {
        // An error that occurred in the normal user workflow:
        // (failed sign-in, team slug not found, javascript build failure, etc...)
        // in which case we don't want to display a stack trace but just a specific error message
        console.error(chalk.red.bold(`${EOL}${err.message}${EOL}`));

        if (err.errorDetails) {
          console.error(chalk.red(err.errorDetails));
        }
      } else {
        // Default error outputs otherwise
        console.error(err);
      }

      return;
    }

    console.log(yargs.help());
    console.log(msg);
  } catch (e) {
    // Any error thrown into fail() callback would be silenced so we make sure
    // nothing pops out
    console.error('Error in .fail():', err);
  } finally {
    process.exit(-1);
  }
}).showHelpOnFail(false).argv;