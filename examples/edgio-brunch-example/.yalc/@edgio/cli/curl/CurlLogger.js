"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = require("chalk");

class CurlLogger {
  constructor({
    json = false,
    debug = false
  } = {}) {
    this._jsonOnly = json;
    this._debugMode = debug;
  }

  error(...messages) {
    this.log(...messages.map(msg => (0, _chalk.red)(msg)));
  }

  debug(...messages) {
    if (this._debugMode) {
      this.log(...messages.map(msg => (0, _chalk.gray)(msg)));
    }
  }

  info(...messages) {
    this.log(...messages.map(msg => (0, _chalk.gray)(msg)));
  }

  log(...messages) {
    if (!this._jsonOnly) {
      console.log(...messages);
    }
  }

  json(object) {
    if (this._jsonOnly) {
      console.log(JSON.stringify(object));
    }
  }

}

exports.default = CurlLogger;
module.exports = exports.default;