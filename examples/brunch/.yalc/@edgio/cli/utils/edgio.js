'use strict';

const fse = require('fs-extra');

const path = require('path');

const edgioVersionPath = absoluteNextDistDir => path.join(absoluteNextDistDir, '.edgio', 'EDGIO_VERSION');

exports.checkProjectBuilt = async absoluteNextDistDir => {
  return fse.pathExists(edgioVersionPath(absoluteNextDistDir));
};

exports.readEdgioVersion = async absoluteNextDistDir => {
  return (await fse.readFile(edgioVersionPath(absoluteNextDistDir), 'utf8')).trim().replace(/\+.*/, ''); // remove the suffix appended by yalc
};