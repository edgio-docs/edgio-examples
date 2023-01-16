"use strict";

const {
  existsSync,
  createWriteStream
} = require('fs');

const {
  join
} = require('path');

module.exports = function addIgnore(dir) {
  // Add `.edgio` to the gitignore file
  const ignorePath = join(dir || process.cwd(), '.gitignore');

  if (existsSync(ignorePath)) {
    const stream = createWriteStream(ignorePath, {
      flags: 'a'
    });
    stream.write('# Edgio generated build directory\n.edgio' + '\n');
    stream.end();
  }
};