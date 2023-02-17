"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const logo_1 = __importDefault(require("@edgio/core/utils/logo"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const ora = require('ora');
const { join } = require('path');
const { DeploymentBuilder } = require('@edgio/core/deploy');
const nextTransform = join(__dirname, 'mods', 'next-config.js');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');
async function codemod(transform, path) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        const p = cross_spawn_1.default(jscodeshiftExecutable, ['--fail-on-error', '--run-in-band', '-t', transform, path], {
            stdio: 'pipe',
        });
        let output = '';
        (_a = p.stdout) === null || _a === void 0 ? void 0 : _a.on('data', data => (output += data));
        (_b = p.stderr) === null || _b === void 0 ? void 0 : _b.on('data', data => (output += data));
        p.on('close', code => {
            if (code === 0) {
                resolve(output);
            }
            else {
                reject(new Error(output));
            }
        });
    });
}
/**
 * Adds all required dependencies and files to the user's app by copying them
 * over from src/default-app.
 */
async function init() {
    const builder = new DeploymentBuilder(process.cwd()).addDefaultAppResources(join(__dirname, 'default-app'));
    const message = `Adding ${logo_1.default} plugins to next.config.js...`;
    let spinner = ora(message).start();
    try {
        await codemod(nextTransform, 'next.config.js');
        spinner.succeed(message + ' done.');
    }
    catch (e) {
        spinner.fail(message);
        console.error(e.message);
    }
    builder.addDefaultEdgioScripts();
}
exports.default = init;
