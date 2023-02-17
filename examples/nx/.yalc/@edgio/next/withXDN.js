"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CommonsServerChunkPlugin_1 = __importDefault(require("./webpack/CommonsServerChunkPlugin"));
function isXdnDevtoolsInstalled() {
    try {
        require('@xdn/devtools/widget/install');
        return true;
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND')
            return false;
        throw e;
    }
}
module.exports = function withXDN(_nextConfig) {
    var _this = this;
    var normalizedNextConfig = typeof _nextConfig === 'function' ? _nextConfig : function () { return _nextConfig || {}; };
    var plugin = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var nextConfig = normalizedNextConfig.apply(void 0, __spread(args));
        return __assign(__assign({}, nextConfig), { target: 'serverless', withXDNApplied: true, webpack: function (config, options) {
                var _a, _b;
                var webpackConfig = __assign({}, (((_a = nextConfig.webpack) === null || _a === void 0 ? void 0 : _a.call(nextConfig, config, options)) || config));
                if (options.webpack.version.startsWith('5')) {
                    Object.assign(config, {
                        resolve: __assign(__assign({}, config.resolve), { fallback: __assign(__assign({}, (_b = config.resolve) === null || _b === void 0 ? void 0 : _b.fallback), { process: false }) }),
                    });
                }
                if (!options.isServer) {
                    // Adding Devtools to client JS file
                    if (isXdnDevtoolsInstalled()) {
                        var originalEntry_1 = config.entry;
                        config.entry = function () { return __awaiter(_this, void 0, void 0, function () {
                            var entries;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, originalEntry_1()];
                                    case 1:
                                        entries = _a.sent();
                                        if (!entries['main.js'].includes('@xdn/devtools/widget/install')) {
                                            entries['main.js'].unshift('@xdn/devtools/widget/install');
                                        }
                                        return [2 /*return*/, entries];
                                }
                            });
                        }); };
                    }
                }
                if (options.isServer && process.env.NODE_ENV === 'production') {
                    config.output.chunkFilename = '[name].js';
                    config.optimization.splitChunks = {
                        cacheGroups: {
                            default: false,
                            vendors: false,
                            commons: {
                                // Note that the name of the chunk is very important.  If the name doesn't include "webpack-runtime",
                                // Next.js's PagesManifestPlugin will fail to include each page in the server build's pages-manifest.json
                                // and the build will fail with an error like "module not found for page /".
                                // See this line in PagesManifestPlugin:
                                // https://github.com/vercel/next.js/blob/210a6980d2d630e0ed7c67552a6ebf96921dac15/packages/next/build/webpack/plugins/pages-manifest-plugin.ts#L38
                                name: 'webpack-runtime-commons',
                                reuseExistingChunk: true,
                                minChunks: 1,
                                chunks: 'all',
                                test: /node_modules/,
                            },
                        },
                    };
                    config.plugins.push(new CommonsServerChunkPlugin_1.default());
                }
                return Object.assign(webpackConfig, config);
            } });
    };
    if (typeof _nextConfig === 'function') {
        return plugin;
    }
    else {
        return plugin();
    }
};
