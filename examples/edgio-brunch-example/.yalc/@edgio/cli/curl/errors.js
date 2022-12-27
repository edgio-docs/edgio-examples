"use strict";

class CommandError extends Error {
  constructor(cmd, stderr) {
    super(stderr);
    this.command = cmd;
  }

}

class CurlUnsupportedArgumentError extends Error {
  constructor(arg) {
    super(`Curl argument "${arg}" is reserved and is required internally by Edgio curl`);
  }

}

class CurlCommandError extends CommandError {
  constructor(e) {
    super(e.command, e.stderr);
  }

}

module.exports = {
  CurlUnsupportedArgumentError,
  CurlCommandError,
  CommandError
};