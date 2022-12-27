"use strict";

exports.command = 'config';
exports.describe = 'Allows to manage cli configuration';

exports.builder = yargs => yargs.commandDir('config').demandCommand();