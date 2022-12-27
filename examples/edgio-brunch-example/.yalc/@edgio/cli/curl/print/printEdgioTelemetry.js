"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printEdgioTelemetry;

var _chalk = require("chalk");

var _logo = _interopRequireDefault(require("../../utils/logo"));

var _pad = require("../../utils/pad");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Render millisecond values
const millisecondValue = v => {
  if (!isNaN(v)) {
    return (0, _chalk.cyan)(`${v}ms`);
  }

  return v;
};

const queuedValue = v => {
  const numberV = +v;

  if (numberV <= 1) {
    return (0, _chalk.green)(v);
  } else if (numberV > 10) {
    return (0, _chalk.red)(v);
  } else if (numberV > 1) {
    return (0, _chalk.yellow)(v);
  } else {
    return (0, _chalk.cyan)(v);
  }
};

const megabytesValue = v => (0, _chalk.cyan)(`${v}mb`);

const cachingStatusValue = v => {
  if (v === 'hit') {
    return (0, _chalk.green)(v);
  } else if (v === 'miss') {
    return (0, _chalk.red)(v);
  } else if (v === 'cached') {
    return (0, _chalk.yellow)(v);
  } else if (v === 'pass') {
    return (0, _chalk.yellow)(v);
  } else {
    return (0, _chalk.cyan)(v);
  }
}; // NOTE: Message should be as short and meaningful as possible.


const X_0_T_DECODED_VALUES = {
  // v4
  // Edge POP
  eh: {
    message: 'Edge POP total time of',
    formatValue: millisecondValue
  },
  ect: {
    message: 'Edge POP Varnish total time of',
    formatValue: millisecondValue
  },
  ecc: {
    message: 'Edge POP caching status',
    formatValue: cachingStatusValue
  },
  edt: {
    message: 'Edge POP DPS total time of',
    formatValue: millisecondValue
  },
  edd: {
    message: 'Edge POP DPS DNS lookup time of',
    formatValue: millisecondValue
  },
  edf: {
    message: 'Edge POP DPS Fetch time of',
    formatValue: millisecondValue
  },
  dgpop: {
    message: 'Edge POP DPS Global POP target',
    formatValue: _chalk.cyan
  },
  ecwt: {
    message: 'Edge POP caching queue wait time of',
    formatValue: millisecondValue
  },
  gh: {
    message: 'Global POP HAProxy total time of',
    formatValue: millisecondValue
  },
  gct: {
    message: 'Global POP Varnish total time of',
    formatValue: millisecondValue
  },
  gcc: {
    message: 'Global POP caching status',
    formatValue: cachingStatusValue
  },
  gdt: {
    message: 'Global POP DPS total time of',
    formatValue: millisecondValue
  },
  gdd: {
    message: 'Global POP DPS DNS lookup time of',
    formatValue: millisecondValue
  },
  gdf: {
    message: 'Global POP DPS fetch time to backend of',
    formatValue: millisecondValue
  },
  gcwt: {
    message: 'Global POP caching queue wait time of',
    formatValue: millisecondValue
  },
  // XBP
  pt: {
    message: 'XBP Total time of',
    formatValue: millisecondValue
  },
  pc: {
    message: 'XBP total request count (> 1 = queued)',
    formatValue: queuedValue
  },
  pf: {
    message: 'XBP Total Fetch time to serverless of',
    formatValue: millisecondValue
  },
  // Serverless
  wm: {
    message: 'Serverless worker memory used',
    formatValue: megabytesValue
  },
  wbt: {
    message: 'Serverless billed time of',
    formatValue: millisecondValue
  },
  wt: {
    message: 'Serverless total time of',
    formatValue: millisecondValue
  },
  wc: {
    message: 'Serverless instance has been invoked',
    formatValue: _chalk.cyan
  },
  wg: {
    message: 'Serverless instance age of',
    formatValue: millisecondValue
  },
  wl: {
    message: 'Serverless Sum of worker times of',
    formatValue: millisecondValue
  },
  wr: {
    message: 'Serverless Time spent evaluating route of',
    formatValue: millisecondValue
  },
  wp: {
    message: 'Serverless Worker fetch or proxy time of',
    formatValue: millisecondValue
  },
  wa: {
    message: 'Serverless transformRequest time of',
    formatValue: millisecondValue
  },
  wz: {
    message: 'Serverless transformResponse time of',
    formatValue: millisecondValue
  },
  // v3
  // Edge POP
  ot: {
    message: 'Edge POP total processing time of',
    formatValue: millisecondValue
  },
  or: {
    message: 'Edge POP time spent matching routes',
    formatValue: millisecondValue
  },
  of: {
    message: 'Edge POP time spent fetching the response',
    formatValue: millisecondValue
  },
  oc: {
    message: 'Edge POP caching status',
    formatValue: cachingStatusValue
  },
  ow: {
    message: 'Edge POP free memory in bytes after req',
    formatValue: _chalk.cyan
  },
  oq: {
    message: 'Edge POP time spent in fetch queue during coalescing',
    formatValue: millisecondValue
  },
  // Shield POP
  st: {
    message: 'Shield POP time spent processing the request',
    formatValue: millisecondValue
  },
  sr: {
    message: 'Shield POP time spent matching routes',
    formatValue: millisecondValue
  },
  sf: {
    message: 'Shield POP time spent fetching the response',
    formatValue: millisecondValue
  },
  sc: {
    message: 'Shield POP caching status',
    formatValue: cachingStatusValue
  },
  sw: {
    message: 'Shield POP free memory in bytes after req',
    formatValue: _chalk.cyan
  },
  sq: {
    message: 'Shield POP time spent in fetch queue during coalescing',
    formatValue: millisecondValue
  },
  // XBP
  bf: {
    message: 'XBP Total Fetch time to serverless of',
    formatValue: millisecondValue
  }
}; // This is used to generate paddings in terminal output. This will return the length og longes message
// in X_0_T_DECODED_VALUES

const LONGEST_DECODED_MESSAGE_LENGTH = Object.values(X_0_T_DECODED_VALUES).sort((a, b) => {
  return b.message.length - a.message.length;
})[0].message.length;

function printEdgioTelemetry(curlResponse, {
  logger,
  internalArgs
}) {
  if (!internalArgs.x0t) {
    return;
  }

  const x0t = curlResponse.lastHeaderGroup().headers.findByName('x-0-t');

  if (!x0t) {
    return;
  }

  logger.info((0, _chalk.cyan)(`${_logo.default} Telemetry`));
  const telemetryGroups = x0t.value.split(',').map(v => v.split('=').map(v => v.trim()));
  telemetryGroups.forEach(([name, value]) => {
    const decodedTelemetryValue = X_0_T_DECODED_VALUES[name];

    if (decodedTelemetryValue) {
      logger.info(`  ${(0, _pad.padEnd)(decodedTelemetryValue.message, LONGEST_DECODED_MESSAGE_LENGTH)} ${decodedTelemetryValue.formatValue(value)} (${name})`);
    } else {
      logger.info(`  ${(0, _chalk.yellow)((0, _pad.padEnd)('Unknown Telemetry', LONGEST_DECODED_MESSAGE_LENGTH))} ${(0, _chalk.yellow)(value)} (${name})`);
    }
  });
}

module.exports = exports.default;