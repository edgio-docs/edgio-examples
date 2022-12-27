"use strict";

const {
  green,
  bold,
  gray,
  underline,
  blueBright
} = require('chalk');

const brandify = require('./brandify');

const os = require('os');

const showEmojis = os.platform() !== 'win32';
const emoji = showEmojis ? value => value : () => '';

function announceSuccessfulDeployment(build) {
  const consoleUrl = build.consoleUrl;
  const siteUrls = build.environment.activeUrls;
  const permalinkUrl = build.url;
  const consoleLabel = emoji('🖥  ') + 'Edgio Developer Console:';
  const siteLabel = emoji('🌎 ') + brandify('Edge:');
  const permalinkLabel = emoji('🔗 ') + 'Permalink:';
  const title = ` Deployment Complete `;
  const lineLength = Math.max(Math.max(title.length, consoleUrl.length, ...siteUrls.map(url => url.length), permalinkUrl.length), 50);

  const pad = (str = '', padChar = ' ', additionalLength = 0) => str.padEnd(lineLength + additionalLength, padChar);

  return [green('*****' + pad(bold(title), '*', 5) + '*****'), green('*  ' + pad() + '  *'), green('*  ' + pad(consoleLabel, ' ', showEmojis ? 1 : 0) + '  *'), green('*  ') + gray(pad(consoleUrl)) + green('  *'), green('*  ' + pad() + '  *'), green('*  ' + pad(permalinkLabel) + '  *'), green('*  ') + gray(pad(permalinkUrl)) + green('  *'), green('*  ' + pad() + '  *'), // The colored siteLabel has different length than in reality (colored chars), we need to properly
  // align it.
  green('*  ' + pad(siteLabel, ' ', siteLabel.length - (showEmojis ? 8 : 7)) + '  *'), ...siteUrls.map(siteUrl => green('*  ') + blueBright(pad(underline(siteUrl), ' ', 9)) + green('  *')), green('*  ' + pad() + '  *'), green('***' + pad('', '*') + '***')].join('\n');
}

module.exports = announceSuccessfulDeployment;