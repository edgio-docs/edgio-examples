#!/usr/bin/env node
// Note that this file should be invoked through index.js as it correctly sets the default header value.
"use strict";

const importLocal = require('import-local');

if (process.argv.includes('--use-global')) {
  require('./cli');
} else if (!importLocal(__filename)) {
  // We use the locally installed version from package.json if available. This lets the user
  // have different versions of the cli for each project without needing to `npm run l0` for
  // all commands. If we get here importLocal has successfully found and run the local version
  // of the CLI so we can just return.
  require('./cli');
}