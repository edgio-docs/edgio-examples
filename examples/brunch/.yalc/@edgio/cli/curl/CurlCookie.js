"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class CurlCookie {
  constructor(name, value, params = []) {
    this.name = name;
    this.value = value;
    this.parameters = params;
  }
  /**
   * Extract cookie name and value from CurlHeader set-cookie
   */


  static parseFromCurlHeader(curlHeader) {
    const [nameAndValue, ...other] = curlHeader.value.split(';').map(p => p.trim());
    const [name, value] = nameAndValue.split('=');
    return new CurlCookie(name, value, other);
  }

}

exports.default = CurlCookie;
module.exports = exports.default;