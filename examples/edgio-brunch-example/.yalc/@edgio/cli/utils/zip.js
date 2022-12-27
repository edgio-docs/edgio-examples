"use strict";

const _excluded = ["logger", "selectors"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const yazl = require('yazl');

const path = require('path');

const fse = require('fs-extra');

const globby = require('globby');

exports.zipFolder = async (folder, targetZipFile, _ref = {}) => {
  let {
    logger,
    selectors = ['**']
  } = _ref,
      globbyOptions = _objectWithoutProperties(_ref, _excluded);

  const buildFiles = await globby(selectors, _objectSpread({
    cwd: folder
  }, globbyOptions));
  var zipfile = new yazl.ZipFile();

  for (const file of buildFiles) {
    logger && logger.verbose(`Adding file: ${file}`);
    zipfile.addFile(path.join(folder, file), file);
  }

  const zipFileWriteStream = zipfile.outputStream.pipe(fse.createWriteStream(targetZipFile));
  zipfile.end();
  return new Promise((resolve, reject) => {
    zipFileWriteStream.on('close', () => resolve()); // TODO: test failing case

    zipFileWriteStream.on('error', err => reject(err));
  });
};