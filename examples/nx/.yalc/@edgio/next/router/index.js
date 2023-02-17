"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NextRoutes_1 = __importDefault(require("./NextRoutes"));
exports.nextRoutes = new NextRoutes_1.default();
var renderNextPage_1 = require("./renderNextPage");
exports.renderNextPage = renderNextPage_1.renderNextPage;
