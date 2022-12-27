"use strict";

const open = require('open');

const DOCS_URL = 'https://docs.edg.io';
exports.command = 'docs';
exports.describe = 'Opens Edgio documentation in your browser';
exports.builder = {};

exports.handler = async () => open(DOCS_URL);