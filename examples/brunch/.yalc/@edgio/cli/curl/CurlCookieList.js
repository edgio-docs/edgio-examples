"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class CurlCookieList {
  constructor(curlCookieList = []) {
    this.cookieList = curlCookieList;
  }

  findByName(name) {
    return this.cookieList.find(h => h.name === name);
  }

  each(fn) {
    return this.cookieList.forEach(fn);
  }

}

exports.default = CurlCookieList;
module.exports = exports.default;