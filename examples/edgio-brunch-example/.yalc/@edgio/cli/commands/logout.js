"use strict";

exports.command = 'logout';
exports.describe = 'Logs you out of Edgio';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await context.logout();
};