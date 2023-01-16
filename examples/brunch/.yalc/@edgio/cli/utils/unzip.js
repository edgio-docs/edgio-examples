"use strict";

const yauzl = require('yauzl');

const fse = require('fs-extra');

const path = require('path');
/**
 * --- This function was copied from the build lambda ---
 * Unzip a ZIP file given as a buffer into a target directory.
 *
 * Unfortunately there doesn't seem to be any good ready-to-use solution
 * to do that in NodeJS (https://nervous.io/node/javascript/2017/02/06/npm-unzip/).
 *
 * So we use the implementation suggested by https://github.com/thejoshwolfe/yauzl/blob/master/examples/unzip.js
 * slightly adapted and simplified.
 */


module.exports = async function unzip(srcFile, targetDirectory) {
  return new Promise((resolve, reject) => {
    yauzl.open(srcFile, {
      lazyEntries: true,
      autoClose: true
    }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.on('end', () => {
        resolve();
      });
      zipfile.readEntry();
      zipfile.on('entry', function (entry) {
        const absoluteFilename = path.join(targetDirectory, entry.fileName);

        if (/\/$/.test(absoluteFilename)) {
          // directory file names end with '/'
          fse.mkdirp(absoluteFilename, function (err) {
            if (err) throw err;
            zipfile.readEntry();
          });
        } else {
          // ensure parent directory exists
          fse.mkdirp(path.dirname(absoluteFilename), function (err) {
            if (err) return reject(err);
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) throw err; // pump file contents

              var writeStream = fse.createWriteStream(absoluteFilename);
              writeStream.on('close', () => {
                zipfile.readEntry();
              });
              readStream.pipe(writeStream);
            });
          });
        }
      });
    });
  });
};