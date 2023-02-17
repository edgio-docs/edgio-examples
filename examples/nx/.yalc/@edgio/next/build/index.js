"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getDistDir_1 = __importDefault(require("../util/getDistDir"));
const createBuildEntryPoint_1 = __importDefault(require("./createBuildEntryPoint"));
exports.default = createBuildEntryPoint_1.default({
    srcDir: '.',
    distDir: getDistDir_1.default(),
    buildCommand: 'npx next build',
});
