'use strict';

const sharp = require('sharp');
/**
 * Resizes the image to fix within the desired height and width. If the aspect ratio
 * is changed, the resulting image is padded.
 * @param {Number} height The height in pixels
 * @param {Number} width The width in pixels
 * @param {Object} image A sharp instance
 */


module.exports = function setSize({
  height,
  width,
  image
}) {
  if (height && width) {
    image.resize({
      width: Number(width),
      height: Number(height),
      fit: sharp.fit.contain
    });
  } else if (height) {
    image.resize({
      height: Number(height)
    });
  } else if (width) {
    image.resize({
      width: Number(width)
    });
  }
};