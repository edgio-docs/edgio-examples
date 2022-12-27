"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const path = require('path');

const {
  MissingEdgioPackagesError
} = require('./errors');

const isEmpty = require('lodash/isEmpty');

const getValue = require('lodash/get'); // packages in the @edgio namespace, but not part of the monorepo


const nonEdgioPackages = ['@edgio/rum'];

class EdgioPackageJson {
  /**
   * Creates class instance for packageJson manipulation
   * @param {String} givenPath path to project working directory
   */
  constructor(givenPath = '.') {
    _defineProperty(this, "EDGIO_PACKAGE_PREFIX", '@edgio/');

    _defineProperty(this, "package", void 0);

    _defineProperty(this, "path", void 0);

    // Absoulte path to packageJson
    const absolutePath = path.resolve(process.cwd(), givenPath);
    this.path = path.join(absolutePath, 'package.json'); // Load Package.json

    this.load();
  }
  /**
   * Loads package.json
   */


  load() {
    try {
      this.package = require(this.path);
      return this.package;
    } catch (e) {
      return this.package = {};
    }
  }
  /**
   *  Returns a compiled list of dev and runtime edgio packages
   */


  edgioAllPackages() {
    return [...this.edgioRuntimeDependencies(), ...this.edgioDevDependencies()];
  }
  /**
   * Returns a edgio version found in package.json
   */


  findCurrentEdgioVersion() {
    const allPackages = this.edgioAllPackages();

    if (isEmpty(allPackages)) {
      throw new MissingEdgioPackagesError(`There are no '@edgio' packages installed in ${this.path}`);
    }

    return allPackages[0][1];
  }
  /**
   * Return list of edgio runtime dependencies
   */


  edgioRuntimeDependencies() {
    return this.edgioDependencies(this.find('dependencies', {}));
  }
  /**
   * Returns list of edgio dev dependencies
   */


  edgioDevDependencies() {
    return this.edgioDependencies(this.find('devDependencies', {}));
  }
  /**
   * Returns entries for all @edgio/* packages in the specified object
   */


  edgioDependencies(packages) {
    return Object.entries(packages).filter(([name]) => name.startsWith(this.EDGIO_PACKAGE_PREFIX) && !nonEdgioPackages.includes(name));
  }
  /**
   * Returns package json value by path
   * @param {String} path Path to object key (loash.get)
   */


  find(path, defaultValue = undefined) {
    return getValue(this.package, path, defaultValue);
  }
  /**
   * Loads package.json
   * @param {String} givenPath
   */


  static loadPackageJson(givenPath) {
    return new EdgioPackageJson(givenPath).package;
  }

}

module.exports = EdgioPackageJson;