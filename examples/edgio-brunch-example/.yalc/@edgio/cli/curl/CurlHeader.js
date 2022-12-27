"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class CurlHeader {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(rawHeaderLine) {
    const [name, ...rest] = rawHeaderLine.split(':');
    const value = rest.join(':');
    return new CurlHeader(name.trim().toLowerCase(), value.trim());
  }

}

exports.default = CurlHeader;
module.exports = exports.default;