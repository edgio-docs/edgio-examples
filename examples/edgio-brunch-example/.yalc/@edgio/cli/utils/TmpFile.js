"use strict";

const tmpPromise = require('tmp-promise');

const fse = require('fs-extra');

class TmpFile {
  constructor(tmpFile) {
    this._tmpFile = tmpFile;
  }

  path() {
    return this._tmpFile.path;
  }

  fd() {
    return this._tmpFile.fd;
  }

  cleanup() {
    return this._tmpFile.cleanup();
  }

  async read() {
    return (await fse.readFile(this.path())).toString();
  }

  async write(content) {
    return await fse.writeFile(this.path(), content);
  }

  static async create(opts = {}) {
    const tmpFile = await tmpPromise.file(opts);
    return new TmpFile(tmpFile);
  }

}

module.exports = TmpFile;