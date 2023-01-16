"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class CurlHeaderList {
  constructor(curlHeaderList = []) {
    this.headerList = CurlHeaderList.sortHeaders(curlHeaderList);
  }

  findByName(name) {
    return this.headerList.find(h => h.name === name);
  }

  each(fn) {
    return this.headerList.forEach(fn);
  }

  getCookies() {
    return this.headerList.filter(h => h.name === 'set-cookie');
  }

  static sortHeaders(curlHeaderList) {
    return curlHeaderList.sort((x, y) => {
      if (x.name < y.name) {
        return -1;
      }

      if (x.name > y.name) {
        return 1;
      }

      return 0;
    });
  }

}

exports.default = CurlHeaderList;
module.exports = exports.default;