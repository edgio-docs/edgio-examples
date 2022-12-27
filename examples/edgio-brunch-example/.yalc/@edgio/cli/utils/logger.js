"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const chalk = require('chalk');

const {
  mapValues
} = require('lodash');

const {
  formatDuration
} = require('./time');

const logWithChalk = color => (...messages) => {
  console.log(highlightWithChalk(color)(...messages));
};

const highlightWithChalk = color => (...messages) => {
  let chalkLogger = chalk;

  if (color) {
    chalkLogger = chalkLogger[color];
  }

  return chalkLogger(...messages);
};

class Logger {
  constructor(context) {
    this.context = context;
  }

  async step(title, options, stepFn) {
    if (!stepFn) {
      stepFn = options;
      options = {};
    }

    const {
      doneTitle = 'done'
    } = options;
    const hrStart = process.hrtime();
    console.log(); // new line

    this.title(title);
    const result = await stepFn();
    const hrEnd = process.hrtime(hrStart);
    const ms = Math.round(hrEnd[0] * 1000 + hrEnd[1] / 1000000);
    this.title(`${doneTitle} ${chalk.grey(formatDuration(ms))}`);
    return result;
  }

  title(msg) {
    console.log(chalk.bold(msg));
  }

  debug(...args) {
    if (this.context.verbose) {
      logWithChalk('grey')(...args);
    }
  }

  info(...args) {
    logWithChalk()(...args);
  }

  success(...args) {
    logWithChalk('green')(...args);
  }

  error(...args) {
    logWithChalk('red')(...args);
  }

  warn(...args) {
    logWithChalk('yellow')(...args);
  }

  verbose(msg) {
    if (this.context.verbose) {
      logWithChalk('grey')(msg);
    }
  }

  graphqlQuery(query, variables = {}, files = {}) {
    this.verbose(`GraphQL query: ${query.split('\n').map(s => s.trim()).join(' ')} with variables: ${JSON.stringify(_objectSpread(_objectSpread({}, variables), mapValues(files, () => '<FILE>')))}`);
  }

  graphqlResponse(data) {
    this.verbose(`GraphQL response: ${JSON.stringify(data)}`);
  }
  /**
   * Returns just the highlighted message without logging
   * @returns {String}
   */


  highlight(color, ...args) {
    return highlightWithChalk(color)(...args);
  }

}

module.exports = Logger;