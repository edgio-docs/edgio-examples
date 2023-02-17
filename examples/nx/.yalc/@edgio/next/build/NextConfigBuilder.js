"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@edgio/core/utils");
const path_1 = require("path");
const constants_1 = require("../config/constants");
const nft_1 = require("@vercel/nft");
const getNextConfig_1 = __importDefault(require("../getNextConfig"));
const getDistDir_1 = __importDefault(require("../util/getDistDir"));
const fs_1 = __importDefault(require("fs"));
/**
 *  NextConfigBuilder creates the buildtime version and runtime version of next.config.js file.
 *  The runtime version is the original version of next.config.js file.
 *
 *  This nextConfigHandler serves Next config.
 *  For performance reason when no publicRuntimeConfig or serverRuntimeConfig property is presented,
 *  only the buildtime version of config is returned, otherwise the runtime version is evaluated
 *  and publicRuntimeConfig and serverRuntimeConfig properties added.
 */
class NextConfigBuilder {
    constructor(builder, options) {
        var _a, _b, _c;
        // For performance reason we don't want to trace these dependencies
        // as they will be always added to build
        this.ignoredDependencies = [
            './node_modules/@edgio/next/config/constants.js',
            './node_modules/@edgio/next/config/index.js',
            './node_modules/@edgio/next/index.js',
            './node_modules/@edgio/next/withEdgio.js',
            './node_modules/@edgio/next/withEdgioInternal.js',
            './node_modules/@edgio/next/sw/index.js',
            './node_modules/@edgio/next/sw/withServiceWorker.js',
            './node_modules/@edgio/next/sw/withServiceWorkerInternal.js',
            './node_modules/@edgio/next/util/nextRuntimeConfigExists.js',
        ];
        this.builder = builder;
        this.useServerBuild = (_a = options.useServerBuild) !== null && _a !== void 0 ? _a : false;
        this.generateSourceMap = (_b = options.generateSourceMap) !== null && _b !== void 0 ? _b : true;
        this.distDir = (_c = options.distDir) !== null && _c !== void 0 ? _c : getDistDir_1.default();
    }
    /**
     * Returns the list of next.config.js file dependencies
     * @return
     */
    async getDependencies() {
        console.log(`> Searching for dependencies of next config file`);
        const { fileList } = await nft_1.nodeFileTrace(['next.config.js'], {
            ignore: [
                ...this.ignoredDependencies,
                // Do not resolve symlinks to .yalc folder
                ...this.ignoredDependencies.map(file => file.replace('./node_modules/', '.yalc/')),
            ],
        });
        // filter out duplicates
        return [...new Set(fileList)];
    }
    /**
     * Copies the dependencies to lambda folder
     * @return
     */
    async copyDependencies(dependencies) {
        console.log(`> Copying dependencies of next config file`);
        const includedDependencies = [
            // We need to include external dependencies which may customer use
            ...dependencies,
            ...this.ignoredDependencies,
        ];
        includedDependencies.forEach(file => {
            this.builder.copySync(file, path_1.join(this.builder.jsDir, file), {
                overwrite: false,
                errorOnExist: false,
                filter: file => fs_1.default.lstatSync(file).isFile(),
            });
        });
    }
    /**
     * Creates the file with runtime version of next.config.js.
     * This file is same as the original one.
     * @return
     */
    async writeRuntimeVersion() {
        this.builder.copySync(path_1.join(process.cwd(), 'next.config.js'), path_1.join(this.builder.jsDir, constants_1.NEXT_RUNTIME_CONFIG_FILE));
    }
    /**
     * Creates the file with buildtime version of next.config.js.
     * @return
     */
    async writeBuildtimeVersion() {
        let serverConfig;
        if (this.useServerBuild) {
            const loadConfig = utils_1.nonWebpackRequire('next/dist/server/config').default;
            serverConfig = await loadConfig('phase-production-server', process.cwd());
        }
        else {
            serverConfig = getNextConfig_1.default();
        }
        serverConfig.distDir = this.distDir;
        let serverConfigSrc = `module.exports=${JSON.stringify(serverConfig)}`;
        // All variables in domains config field are resolved during build time but
        // the process.env.EDGIO_IMAGE_OPTIMIZER_HOST is available during runtime.
        // If disableImageOptimizer is set to true, the next/image optimizer is used and
        // we need to replace 'SET_EDGIO_IMAGE_OPTIMIZER_HOST_HERE' by process.env.EDGIO_IMAGE_OPTIMIZER_HOST when build finish to force next/image optimizer to work.
        serverConfigSrc = serverConfigSrc.replace(/["']SET_EDGIO_IMAGE_OPTIMIZER_HOST_HERE["']/, 'process.env.EDGIO_IMAGE_OPTIMIZER_HOST');
        this.builder.writeFileSync(path_1.join(this.builder.jsDir, constants_1.NEXT_BUILDTIME_CONFIG_FILE), serverConfigSrc);
    }
    /**
     * Creates the file with our handler which will return the next config.
     * @return
     */
    async writeHandler() {
        this.builder.copySync(path_1.join(__dirname, 'nextConfigHandler.js'), path_1.join(this.builder.jsDir, constants_1.NEXT_CONFIG_HANDLER_FILE));
    }
    /**
     * Executes the build of next config file and bundle nextConfigHandler together with buildtime version of next.config.js.
     * Then clean after ourselves.
     * @return
     */
    async build() {
        await this.copyDependencies(await this.getDependencies());
        await this.writeRuntimeVersion();
        await this.writeBuildtimeVersion();
        await this.writeHandler();
        console.log(`> Building next config file`);
        const buildCommand = `npx esbuild ${constants_1.NEXT_CONFIG_HANDLER_FILE} --target=es2018 --bundle --minify --platform=node ${this.generateSourceMap ? '--sourcemap' : ''} --outfile=${constants_1.NEXT_CONFIG_FILE} --external:./${constants_1.NEXT_RUNTIME_CONFIG_FILE}`;
        await this.builder.exec(buildCommand, { cwd: this.builder.jsDir });
        this.cleanAfterBuild();
    }
    /**
     * Removes the unsed files after the build
     * @return
     */
    cleanAfterBuild() {
        console.log(`> Cleaning after build of next config file`);
        // Handler was replaced by bundled version
        this.builder.removeSync(path_1.join(this.builder.jsDir, constants_1.NEXT_CONFIG_HANDLER_FILE));
        // The buildtime version is no longer needed because it's included in bundle
        this.builder.removeSync(path_1.join(this.builder.jsDir, constants_1.NEXT_BUILDTIME_CONFIG_FILE));
    }
}
exports.default = NextConfigBuilder;
