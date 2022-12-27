'use strict';

const constants = require('./constants');
/**
 * Converts the image to the desired format and quality
 * @param {Object} image A sharp image instance
 * @param {String} contentType The mime type of the desired format
 * @param {Number} quality The desired quality from 1-100
 */


module.exports = function setQuality({
  image,
  contentType,
  quality
}) {
  if (contentType === constants.contentTypeWebp) {
    image.webp({
      quality
    });
  } else if (contentType === constants.contentTypeJpeg) {
    image.jpeg({
      quality
    });
  } else if (contentType === constants.contentTypePng) {
    image.png({
      quality
    });
  }
};