"use strict";

const {
  red,
  bold,
  cyan
} = require('chalk');

const os = require('os');

const showEmojis = os.platform() !== 'win32';
const emoji = showEmojis ? value => value : () => '';

function announceFailedDeployment(consoleURL) {
  const consoleLabel = emoji('🖥  ') + 'View the build log in Edgio Developer Console:';
  const title = ` Deployment Failed `;
  const lineLength = Math.max(Math.max(title.length, consoleURL.length, consoleLabel.length + 1), 50);

  const pad = (str = '', padChar = ' ', additionalLength = 0) => str.padEnd(lineLength + additionalLength, padChar);

  return [red('*****' + pad(bold(title), '*', 5) + '*****'), red('*  ' + pad() + '  *'), red('*  ' + pad(consoleLabel, ' ', showEmojis ? 1 : 0) + '  *'), red('*  ') + pad(consoleURL) + red('  *'), red('*  ' + pad() + '  *'), red('*  ') + pad('Need help? Try posting in Edgio Developer Forums:') + red('  *'), red('*  ') + cyan(pad('https://forum.edgio.co')) + red('  *'), red('*  ' + pad() + '  *'), red('*  ') + pad('Or browse Edgio Documentation:') + red('  *'), red('*  ') + cyan(pad('https://docs.edg.io')) + red('  *'), red('*  ' + pad() + '  *'), red('***' + pad('', '*') + '***')].join('\n');
}

module.exports = announceFailedDeployment;