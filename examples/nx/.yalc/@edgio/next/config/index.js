"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withEdgio = require('../withEdgio'); // we use require here for backwards compatibility since withEdgio has always used `export =` instead of `export default`
var withServiceWorker_1 = require("../sw/withServiceWorker");
exports.withServiceWorker = withServiceWorker_1.default;
