"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultTo = _interopRequireDefault(require("lodash/defaultTo"));

var _os = require("os");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Option {
  constructor() {
    _defineProperty(this, "_alternativeArgNames", []);

    _defineProperty(this, "_requiresArgValue", false);
  }

  /**
   * Option Type: one of the following strings
   *    'array': synonymous for array: true, see array()
   *    'boolean': synonymous for boolean: true, see boolean()
   *    'count': synonymous for count: true, see count()
   *    'number': synonymous for number: true, see number()
   *    'string': synonymous for string: true, see string()
   *
   * Required: true
   *
   * Ref: https://yargs.js.org/docs/#api-reference-demandoptionkey-msg-boolean
   */
  type(name) {
    this._type = name;
    return this;
  }
  /**
   * Sets argument value as required. This would require --something to have a value e.g
   *  - 0 curl xx.co --something value
   */


  requiresArgValue() {
    this._requiresArgValue = true;
    return this;
  }
  /**
   * Argument description displayed in --help
   *
   * Required: true
   */


  description(desc) {
    this._description = desc;
    return this;
  }
  /**
   * Argument in camelCase format. This will be used as option
   * --camel-case or --camelCase
   *
   * Required: true
   *
   * Note: This must be unique, so we do not override some of the curl arguments. All unknown options
   *       will be forwarded to curl command
   */


  argName(name) {
    this._argName = name;
    return this;
  }
  /**
   * Create aliases for option argName e.g for debug: -d
   */


  alternativeArgNames(...listOfAliases) {
    this._alternativeArgNames.push(...listOfAliases);

    return this;
  }
  /**
   * Environment variable name that can be used
   *
   * Required: false
   */


  envName(name) {
    this._envName = name;
    return this;
  }
  /**
   * Default value. Should match type
   *
   * Required: false
   */


  default(anyValue) {
    this._default = anyValue;
    return this;
  }
  /**
   * Load option into Yargs command
   */


  load(command) {
    const yargsOptionConfig = {
      type: this._type,
      default: this._getDefaultWithEnvironmentVariable(),
      alias: this._alternativeArgNames,
      requiresArg: this._requiresArgValue
    };

    if (this._envName) {
      yargsOptionConfig.description = `${this._description}${_os.EOL}[${this._envName}]`;
    } else {
      yargsOptionConfig.description = this._description;
    }

    command.option(this._argName, yargsOptionConfig);
  }
  /**
   * Returns value from environment variable or default
   */


  _getDefaultWithEnvironmentVariable() {
    if (typeof this._default === undefined) return undefined;
    if (!this._envName) return this._default;
    const envValue = process.env[this._envName];

    switch (this._type) {
      case 'boolean':
        {
          var _this$_default;

          return (0, _defaultTo.default)(envValue, (_this$_default = this._default) === null || _this$_default === void 0 ? void 0 : _this$_default.toString()) === 'true';
        }

      case 'string':
        {
          var _this$_default2;

          return (0, _defaultTo.default)(envValue, (_this$_default2 = this._default) === null || _this$_default2 === void 0 ? void 0 : _this$_default2.toString());
        }

      case 'number':
        {
          var _this$_default3;

          return +(0, _defaultTo.default)(envValue, (_this$_default3 = this._default) === null || _this$_default3 === void 0 ? void 0 : _this$_default3.toString());
        }

      case 'count':
        {
          var _this$_default4;

          return +(0, _defaultTo.default)(envValue, (_this$_default4 = this._default) === null || _this$_default4 === void 0 ? void 0 : _this$_default4.toString());
        }

      case 'array':
        {
          const parsedEnvArrayValue = envValue === null || envValue === void 0 ? void 0 : envValue.toString().split(',').map(v => v.trim());
          return (0, _defaultTo.default)(parsedEnvArrayValue, (0, _defaultTo.default)(this._default, []));
        }

      default:
        {
          throw new Error(`Unsupported type for environment variable: ${this._type}`);
        }
    }
  }

}

exports.default = Option;
module.exports = exports.default;