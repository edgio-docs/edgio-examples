#!/usr/bin/env node
'use strict'; // Perform the Node.js version check as early as possible since the runtime Node version
// might not support all the syntax that we have deeper in the code. If we were to reach
// that code, the process would just fail rather than display a compatibility message.

const supportedMajorVersion = '14'; // NODE_VERSION

const [majorVersion] = process.versions.node.split('.');

if (majorVersion !== supportedMajorVersion) {
  let cliVersion;

  try {
    cliVersion = ` ${require('package.json').version}`;
  } catch {
    cliVersion = '';
  }

  if (majorVersion < supportedMajorVersion) {
    console.log(`edgio${cliVersion} supports only Node.js v${supportedMajorVersion} but your current version is ${process.version}.`);
    console.log('You can install the supported version from https://nodejs.org/ or with the "nvm" command from http://nvm.sh');
    process.exit(-1);
  } else if (majorVersion > supportedMajorVersion) {
    console.log(`WARNING: edgio${cliVersion} platform serverless runtime supports only Node.js v${supportedMajorVersion}. Your current version is ${process.version}.`);
    console.log(`If your backend code (SSR, Api endpoints, etc.) uses Node.js ${process.version} features it may not work as expected once deployed on the edgio platform.`);
  }
} // Launch CLI with the new --max-http-header-size option. The size is set to 64kb
// which is the same size we use in XBP. We cannot use the option directly on the bangs
// as not all operating systems/shells support that.


const spawn = require('cross-spawn');

const join = require('path').join;

const args = process.argv.slice(2);
let entry = 'cli-local.js'; // While running "0 curl" we need to run a separate instance of yargs command parser.
// This is because we don't care about the context provided to cli deploy commands and we need
// to allow extra command arguments. There might be a better way for that, but this should work fine.

if (args[0] === 'curl') {
  entry = 'curl/index.js';
} // We have to spawn the node with additional arguments while keeping the user provided arguments.


const child = spawn('node', ['--max-http-header-size=65536', join(__dirname, entry)].concat(args), {
  stdio: 'inherit'
}); // We need the error level of the main process reflect the actual result of the command.

child.on('close', code => process.exit(code));