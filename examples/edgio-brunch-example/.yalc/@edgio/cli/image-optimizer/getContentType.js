'use strict';

const constants = require('./constants');
/**
 * Derives the content type from the fmt parameter
 * @param {String} fmt "webp" or "jpeg"
 * @param {upstreamContentType} The original content-type header from the upstream image
 * @return {String} A mime type
 */


module.exports = function getContentType(fmt, upstreamContentType) {
  if (fmt === constants.formatWebp) {
    return constants.contentTypeWebp;
  } else if (fmt === constants.formatPng) {
    return constants.contentTypePng;
  } else if (fmt === constants.formatJpeg) {
    return constants.contentTypeJpeg;
  } else {
    return upstreamContentType;
  }
};