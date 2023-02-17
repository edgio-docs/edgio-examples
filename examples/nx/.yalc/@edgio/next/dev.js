"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const createDevServer_1 = __importDefault(require("@edgio/core/dev/createDevServer"));
async function dev() {
    // @ts-ignore
    global.EDGIO_NEXT_APP = require('next')({ dev: true });
    return createDevServer_1.default({
        label: 'Next',
        command: port => `npx next dev -p ${port}`,
        ready: [/(started server on|ready on)/i],
    });
}
exports.default = dev;
