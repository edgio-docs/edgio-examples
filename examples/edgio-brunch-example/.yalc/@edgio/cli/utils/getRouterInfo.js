"use strict";

const path = require('path');

const fse = require('fs-extra');

const {
  checkProjectBuilt
} = require('./edgio');

module.exports = async function getRouterInfo(absolutePath) {
  if (!(await checkProjectBuilt(absolutePath))) {
    throw new Error('Please build your edgio project before deploying to cloud!');
  }

  const routerInfoPath = path.join(absolutePath, '.edgio', 'routerInfo.json');

  if (fse.existsSync(routerInfoPath)) {
    return fse.readFileSync(routerInfoPath, 'utf8');
  } else {
    return null;
  }
};