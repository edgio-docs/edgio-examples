"use strict";

const {
  bold,
  yellow
} = require('chalk');

const os = require('os');

const showEmojis = os.platform() !== 'win32';
const emoji = showEmojis ? value => value : () => '';

function announceCanceledDeployment(consoleURL) {
  const consoleLabel = emoji('🖥  ') + 'View the build log in Edgio Developer Console:';
  const title = ` Deployment Canceled `;
  const lineLength = Math.max(Math.max(title.length, consoleURL.length, consoleLabel.length + 1), 50);

  const pad = (str = '', padChar = ' ', additionalLength = 0) => str.padEnd(lineLength + additionalLength, padChar);

  return [yellow('*****' + pad(bold(title), '*', 5) + '*****'), yellow('*  ' + pad() + '  *'), yellow('*  ' + pad(consoleLabel, ' ', showEmojis ? 1 : 0) + '  *'), yellow('*  ') + pad(consoleURL) + yellow('  *'), yellow('*  ' + pad() + '  *'), yellow('***' + pad('', '*') + '***')].join('\n');
}

module.exports = announceCanceledDeployment;