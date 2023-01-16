"use strict";

const {
  AuthenticationError
} = require('./errors');

const {
  getApiKey,
  saveApiKey
} = require('./config');

const fs = require('fs');

const {
  join
} = require('path');

const Api = require('./api');

const Logger = require('./logger');

class Context {
  constructor(argv) {
    let {
      apiUrl,
      token,
      local,
      dev,
      stage,
      verbose,
      nonInteractive,
      ignoreError
    } = argv;
    token = token || process.env.EDGIO_DEPLOY_TOKEN;
    if (local) this.apiUrl = 'http://localhost:3000';else if (dev) this.apiUrl = 'https://api.layer0-dev.co';else if (stage) this.apiUrl = 'https://api.layer0-stage.co';else this.apiUrl = apiUrl; // apiUrl argv has default value of production url, so it can be used as fallback

    this.verbose = verbose;
    this.nonInteractive = nonInteractive || !!token;
    this.apiKey = token || getApiKey(this.apiUrl);
    this.apiKeyOverride = !!token; // Will contain the name of authenticated user

    this.currentActor = null;
    this.api = new Api(this);
    this.logger = new Logger(this);
    this.isLocalDev = !/app\.edgio(-dev)?\.co/.test(this.apiUrl);
    this.ignoreErrors = [];

    if (ignoreError) {
      // Normalizing into an Array
      this.ignoreErrors = typeof ignoreError === 'string' ? [ignoreError] : ignoreError;
    } // yargs is placing current running command in an array
    // in _ (underscore) property


    const command = argv._[0]; // The only time we don't want to show validation message is when
    // "edgio init" itself is executed, on all other commands we should
    // exit the process and show the error

    if (!['init', 'upgrade'].includes(command)) {
      // with edgio rebranding, we changed layer0.config.js name to edgio.config.js
      // so if we only have layer0.config.js we cannot procceed with the command,
      // our only option is to put the warning and explain to user that layer.config.js
      // is depricated and that new configuration must be initialized or migrated from
      // an existing one
      this.validateLegacyConfiguration();
    }
  }

  onLogin(name, apiKey) {
    this.currentActor = {
      name
    };
    this.apiKey = apiKey;
    this.loginAction = null;
    saveApiKey(this.apiUrl, apiKey);
  }

  setLoginAction(action) {
    this.loginAction = action;
  }

  async checkAuthentication() {
    if (!this.apiKey) {
      return;
    }

    try {
      this.currentActor = await this.api.currentActor();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return;
      }

      throw e;
    }
  }

  logout() {
    this.currentActor = null;
    saveApiKey(this.apiUrl, null);
  }

  validateLegacyConfiguration() {
    const layer0Config = join(process.cwd(), 'layer0.config.js');
    const edgioConfig = join(process.cwd(), 'edgio.config.js');

    if (fs.existsSync(layer0Config) && !fs.existsSync(edgioConfig)) {
      this.logger.error(`$layer0.config.js is deprecated. Please run 'edgio init' to initalize a new configuration file.`);
      process.exit(1);
    }
  }

}

module.exports = Context;