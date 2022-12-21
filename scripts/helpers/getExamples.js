const fs = require('fs');
const { join } = require('path');

const examplesPath = join(process.cwd(), 'examples');

/**
 * Returns list of examples names
 * This file is used by CI
 */
module.exports = () =>
  fs
    .readdirSync(examplesPath)
    .filter(
      (item) =>
        fs.lstatSync(join(examplesPath, item)).isDirectory() &&
        fs.existsSync(join(examplesPath, item, 'package.json'))
    );
