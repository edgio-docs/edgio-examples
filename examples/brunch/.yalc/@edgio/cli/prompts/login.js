"use strict";

const os = require('os');

const open = require('open');

const Sockets = require('../utils/sockets');

const loginPrompt = async context => {
  const {
    logger,
    loginAction
  } = context;
  logger.title(`Authenticating user!`);
  const name = `CLI Api Key on ${os.hostname()}`;
  const sockets = new Sockets('AuthenticationChannel', context.apiUrl);

  try {
    await sockets.connect();
  } catch (e) {
    logger.error(`Failed to connect to Edgio`);
    process.exit(1);
  }

  return new Promise(resolve => {
    sockets.emit('authorization_init').on('authorization_init', data => {
      const url = new URL('/account/cli', context.apiUrl); // Adds SID(SocketSessionID) and NAME params required for authentication

      url.searchParams.append('name', name);
      url.searchParams.append('sid', data.uuid); // Adds login action required for dispaying a correct message on the UI of LD

      if (loginAction) {
        url.searchParams.append('action', loginAction);
      }

      logger.info('Please visit this URL from any device and click on "Create access token" to authorize this device:');
      logger.info(url.toString());
      logger.info('\nWaiting for authentication...');
      open(url.toString(), {
        wait: false
      });
    }).on('authorization_token', ({
      api_token,
      email
    }) => {
      context.onLogin(email, api_token);
      logger.success(`🔑 You are now logged in as ${email}${os.EOL}`);
      sockets.close();
      resolve();
    });
  });
};

module.exports = loginPrompt;