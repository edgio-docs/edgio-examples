global.Buffer = require('buffer').Buffer;

global.btoa = function (str) {
  return Buffer.from(str, 'binary').toString('base64');
};

global.atob = function (b64Encoded) {
  return Buffer.from(b64Encoded, 'base64').toString('binary');
};
