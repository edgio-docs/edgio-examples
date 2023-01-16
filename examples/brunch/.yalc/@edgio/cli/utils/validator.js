"use strict";

const dns = require('dns').promises;

const ipaddr = require('ipaddr.js');

class Validator {
  constructor(logger, options = {
    exitOnError: false,
    throwError: false,
    logError: true
  }) {
    this.logger = logger;
    this.exitOnError = options.exitOnError ?? false;
    this.throwError = options.throwError ?? false;
    this.logError = options.logError ?? true;
    this.errors = [];
  }

  get success() {
    return this.errors.length === 0;
  }

  handleError(errorMessage) {
    this.errors.push(errorMessage);

    if (this.logError) {
      this.logger.error(`Error: ${errorMessage}`);
    }

    if (this.throwError) {
      throw new Error(errorMessage);
    }

    if (this.exitOnError) {
      process.exit(1);
    }
  }

  validateSiteName(siteName) {
    if (!siteName) {
      this.handleError(`Couldn't find the site's name. Please add the name property to your package.json file or specify --site param.`);
    }

    if (typeof siteName != 'string') {
      this.handleError(`Site's name has to be string.`);
    }

    if ((siteName === null || siteName === void 0 ? void 0 : siteName.length) === 0) {
      this.handleError(`Site's name can't be empty.`);
    }

    return siteName;
  }
  /**
   * Validates the `domainOrIp` as defined in `config.backends` is either a resolvable
   * domain or a valid IP address format (does not validate connection to IP). If the value
   * as a domain does not resolve, and the value as an IP address does not validate, a
   * warning is logged indicating a potentially unreachable backend.
   *
   * @param {Object} config
   * @returns {Boolean} `true` if all backends are valid; `false` otherwise
   */


  async validateBackends(config) {
    const {
      backends
    } = config ?? {};
    let valid = true;
    if (!backends) return valid;

    for (const [backend, {
      domainOrIp
    }] of Object.entries(backends)) {
      // Currently only IPv4 is supported as a backend. This validates based on pattern.
      const isValidIP = ipaddr.IPv4.isIPv4(domainOrIp); // continue to next entry; skip dns resolution

      if (isValidIP) continue;

      try {
        await dns.resolve(domainOrIp);
      } catch (e) {
        // at this point we're not a valid IP nor resolvable by dns
        this.logger.warn(`Unable to validate domain/IP '${domainOrIp}' for backend '${backend}'.`, 'This may result in failed requests if the domain/IP address cannot be reached after deployment.\n');
        valid = false;
      }
    }

    return valid;
  }

}

module.exports = Validator;