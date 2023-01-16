"use strict";

const kill = require('kill-port');
/**
 * Kills anything running on the ports needed for the app, JS backend, and static backend.
 */


module.exports = async function clearPorts() {
  const startingPort = parseInt(process.env.PORT || 3000);
  await Promise.all([kill(startingPort), kill(startingPort + 1), kill(startingPort + 2)]);
};