"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CurlHeader = _interopRequireDefault(require("./CurlHeader"));

var _CurlHeaderList = _interopRequireDefault(require("./CurlHeaderList"));

var _os = require("os");

var _CurlCookieList = _interopRequireDefault(require("./CurlCookieList"));

var _CurlCookie = _interopRequireDefault(require("./CurlCookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CurlResponse {
  constructor(rawBody, rawHeaders, stdout, stderr, command, options = {}) {
    const {
      returnBody,
      maxBodyLength
    } = options;
    const body = rawBody || '';
    this.command = command; // Stdout is using a template that will return json

    this.variables = this._parseStdout(stdout);
    this.stderr = stderr;
    this.body = body;
    this._truncatedBody = body.slice(0, maxBodyLength);
    this.headers = this._parseHeaders(rawHeaders);
    this._returnBody = returnBody;
  }
  /**
   * Returns length of truncated body
   */


  get truncatedBodyLength() {
    return this._truncatedBody.length;
  }
  /**
   * Returns decorated truncated body e.g xxx...
   */


  get truncatedBody() {
    if (this._truncatedBody.length < this.body.length) {
      return `${this._truncatedBody}...`;
    }

    return this._truncatedBody;
  }

  toJsonObject() {
    const result = {
      variables: this.variables,
      headerGroups: this.headers
    }; // Disabled body for json output

    if (this._returnBody) {
      result.body = this.truncatedBody;
    }

    return result;
  }
  /**
   * Returns last header group. This is used so we can decode
   * internal headers based on last response not based on the redirects.
   * This applies only when using curl with -L
   */


  lastHeaderGroup() {
    return this.headers[this.headers.length - 1];
  }
  /**
   * Parses stdout from curl. This is expected to be parseable with JSON
   */


  _parseStdout(stdout) {
    let curlFormatResult;

    try {
      curlFormatResult = JSON.parse(stdout);
    } catch (e) {
      // Curl format must be parseable as json. See CURL_FORMAT in Curl.js for all the possible options.
      throw new Error(`Failed to parse curl stdout as json. Output Parsed: ${stdout}`);
    }

    return this._buildCurlTemplateResult(curlFormatResult);
  }
  /**
   * Build Response object from curl template
   */


  _buildCurlTemplateResult(templateResult) {
    const time = CurlResponse.parseTimeValuesObject(templateResult.time);
    const speed = CurlResponse.parseSpeedValuesObject(templateResult.speed);
    const size = CurlResponse.parseSizeValuesObject(templateResult.size);
    const range = CurlResponse.getRangeValuesFromParsedTimes(time);
    return _objectSpread(_objectSpread({}, templateResult), {}, {
      speed,
      size,
      time,
      range
    });
  }
  /**
   * Parse all headers
   * Note that while following redirects there can be multiple response headers by each redirect followed.
   *
   * e.g using curl example.com -L
   */


  _parseHeaders(rawHeaders) {
    const headerGroups = [];
    let splittedHeaders = rawHeaders.split(_os.EOL);
    let headerGroupIndex = 0;

    for (let index = 0; index < splittedHeaders.length; index++) {
      const rawHeader = splittedHeaders[index];

      if (!headerGroups[headerGroupIndex]) {
        headerGroups[headerGroupIndex] = [];
      } // Check for empty line between headers to determine groups. That indicates
      // that -L curl option was used if next group is a non empty group.


      if (!rawHeader.trim()) {
        headerGroupIndex++;
        continue;
      }

      headerGroups[headerGroupIndex].push(rawHeader);
    }

    return headerGroups.filter(g => g.length > 0).map(g => {
      const [status, ...headers] = g;
      const [version, statusCode, ...statusMessageParts] = status.trim().split(' ');
      const headerList = new _CurlHeaderList.default(headers.map(raw => _CurlHeader.default.parse(raw)));
      const cookieList = new _CurlCookieList.default(headerList.getCookies().map(_CurlCookie.default.parseFromCurlHeader));
      return {
        version: version,
        statusCode: statusCode,
        statusMessage: statusMessageParts.join(' '),
        headers: headerList,
        cookies: cookieList
      };
    });
  }
  /**
   * Parse time values from curl template
   */


  static parseTimeValuesObject(timesObj) {
    const result = {};
    Object.keys(timesObj).forEach(key => {
      const value = +timesObj[key];

      if (Number.isInteger(value)) {
        // Before 7.61.0, time values are represented as seconds in float
        result[key] = value / 1000;
      } else {
        // from 7.61.0, libcurl uses microsecond in int for time values.
        // ref: https://curl.se/bug/?i=2495
        result[key] = value * 1000;
      }

      result[`${key}Pretty`] = `${Math.round(result[key])}ms`;
    });
    return result;
  }
  /**
   * Parse speed values from curl template
   */


  static parseSpeedValuesObject(speedObj) {
    const result = {};
    Object.keys(speedObj).forEach(key => {
      const value = +speedObj[key];
      result[key] = value / 1024;
      result[`${key}Pretty`] = `${Math.round(result[key])} KiB/s`;
    });
    return result;
  }
  /**
   * Parse size values from curl template
   */


  static parseSizeValuesObject(sizeObj) {
    const result = {};
    Object.keys(sizeObj).forEach(key => {
      const value = +sizeObj[key];
      result[key] = value;
      result[`${key}Pretty`] = `${Math.round(result[key])} bytes`;
    });
    return result;
  }

  static getRangeValuesFromParsedTimes(parsedTimeObj) {
    const result = {};
    const rangesObj = {
      rangeConnection: parsedTimeObj.timeConnect - parsedTimeObj.timeNameLookup,
      rangeSSL: parsedTimeObj.timePretransfer - parsedTimeObj.timeConnect,
      rangeServer: parsedTimeObj.timeStarttransfer - parsedTimeObj.timePretransfer,
      rangeTransfer: parsedTimeObj.timeTotal - parsedTimeObj.timeStarttransfer
    };
    Object.keys(rangesObj).forEach(key => {
      const value = rangesObj[key];
      result[key] = value;
      result[`${key}Pretty`] = `${Math.round(result[key])}ms`;
    });
    return result;
  }

}

exports.default = CurlResponse;
module.exports = exports.default;