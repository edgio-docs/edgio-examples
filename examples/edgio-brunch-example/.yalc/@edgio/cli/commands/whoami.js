"use strict";

const authenticate = require('../prompts/authenticate');

exports.command = 'whoami';
exports.describe = 'Outputs the email address associated with the logged in user';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await authenticate(context);
};