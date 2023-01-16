"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EXCLUDED_CURL_ARGS = exports.CURL_FORMAT = void 0;

var _execa = _interopRequireDefault(require("execa"));

var _TmpFile = _interopRequireDefault(require("../utils/TmpFile"));

var _errors = require("./errors");

var _CurlResponse = _interopRequireDefault(require("./CurlResponse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Ref: https://everything.curl.dev/usingcurl/verbose/writeout#available-write-out-variables
const CURL_FORMAT = JSON.stringify({
  remoteIp: '%{remote_ip}',
  remotePort: '%{remote_port}',
  localIp: '%{local_ip}',
  localPort: '%{local_port}',
  responseCode: '%{response_code}',
  scheme: '%{scheme}',
  urlEffective: '%{url_effective}',
  time: {
    timeNameLookup: '%{time_namelookup}',
    timeConnect: '%{time_connect}',
    timeAppconnect: '%{time_appconnect}',
    timePretransfer: '%{time_pretransfer}',
    timeRedirect: '%{time_redirect}',
    timeStarttransfer: '%{time_starttransfer}',
    timeTotal: '%{time_total}'
  },
  speed: {
    speedDownload: '%{speed_download}',
    speedUpload: '%{speed_upload}'
  },
  size: {
    sizeRequest: '%{size_request}',
    sizeDownload: '%{size_download}',
    sizeHeader: '%{size_header}',
    sizeUpload: '%{size_upload}'
  }
}); // Following options are not supported since those are required for Edgio curl to run.
// So we issue an error when user provided any of the reserved options to 0 curl.

exports.CURL_FORMAT = CURL_FORMAT;
const EXCLUDED_CURL_ARGS = ['-w', '--write-out', '-D', '--dump-header', '-o', '--output', '-s', '--silent'];
exports.EXCLUDED_CURL_ARGS = EXCLUDED_CURL_ARGS;

class Curl {
  constructor(args, opts = {}) {
    this._validateUserArgs(args);

    this._userArgs = args;
    this._curlBinPath = opts.curlBinPath;
    this._responseParserOptions = {
      returnBody: opts.showBody,
      maxBodyLength: opts.maxBodyLength
    };
  }
  /**
   * Execute curl
   *
   * Returns object (CurlResponse result)
   */


  async exec() {
    const bodyFile = await _TmpFile.default.create();
    const headerFile = await _TmpFile.default.create();
    const {
      stdout,
      stderr,
      command
    } = await (0, _execa.default)(this._curlBinPath, this.getCurlArguments(headerFile.path(), bodyFile.path()), {
      env: _objectSpread({}, process.env)
    }).catch(err => {
      bodyFile.cleanup();
      headerFile.cleanup();
      throw new _errors.CurlCommandError(err);
    });
    const rawHeaders = await headerFile.read();
    const rawBody = await bodyFile.read();
    bodyFile.cleanup();
    headerFile.cleanup();
    return new _CurlResponse.default(rawBody, rawHeaders, stdout, stderr, command, this._responseParserOptions);
  }
  /**
   * Returns curl arguments.
   *
   * Note: Order is important. User arguments must be after internal ones.
   *.           Otherwise unfinished (args with no values) will fail with inaccurate error message.
   */


  getCurlArguments(headerFilePath, bodyFilePath) {
    return ['-w', CURL_FORMAT, '-D', headerFilePath, '-o', bodyFilePath, '-s', '-S', ...this._userArgs];
  }
  /**
   * Validated excluded arguments
   */


  _validateUserArgs(args) {
    args.forEach(arg => {
      if (EXCLUDED_CURL_ARGS.includes(arg)) {
        throw new _errors.CurlUnsupportedArgumentError(arg);
      }
    });
  }
  /**
   * Execute curl with arguments
   */


  static run(userArgs, options) {
    return new Curl(userArgs, options).exec();
  }

}

exports.default = Curl;