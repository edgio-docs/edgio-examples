"use strict";

const fns = require('date-fns');

module.exports.formatDuration = function formatDuration(durationInMillis) {
  if (durationInMillis < 1000) {
    return `${durationInMillis}ms`;
  } else {
    const duration = fns.intervalToDuration({
      start: new Date(0),
      end: new Date(durationInMillis)
    });
    return fns.formatDuration(duration).replace(/ hours?/, 'h').replace(/ minutes?/, 'm').replace(/ seconds?/, 's');
  }
};