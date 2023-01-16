"use strict";

const path = require('path');

const fse = require('fs-extra');

const zip = require('./zip');

const filesize = require('filesize');

const {
  checkProjectBuilt
} = require('./edgio');

module.exports = async (absolutePath, yargs) => {
  const {
    context,
    site,
    environment
  } = yargs;
  const {
    logger
  } = context;

  if (!(await checkProjectBuilt(absolutePath))) {
    throw new Error('Please build your edgio project before deploying to cloud!');
  }

  const distDir = '.edgio';
  const absoluteDistDir = path.join(absolutePath, distDir);
  return await logger.step(`📦 Packaging...`, async () => {
    logger.info('> Zipping project folder');
    const projectZip = path.join(absoluteDistDir, `project-${site}-${environment}.zip`);
    await fse.remove(projectZip); // Clear old projext.zip

    await zip.zipFolder(absoluteDistDir, projectZip, {
      logger,
      dot: true
    });
    const zipSize = (await fse.stat(projectZip)).size;
    logger.info(`> Size: ${filesize(zipSize)}`);
    return projectZip;
  });
};