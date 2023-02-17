"use strict";
/* istanbul ignore file */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = __importDefault(require("globby"));
const deploy_1 = require("@edgio/core/deploy");
const path_1 = require("path");
const FrameworkBuildError_1 = __importDefault(require("@edgio/core/errors/FrameworkBuildError"));
const nonWebpackRequire_1 = __importDefault(require("@edgio/core/utils/nonWebpackRequire"));
const validateNextConfig_1 = __importDefault(require("./validateNextConfig"));
const nft_1 = require("@vercel/nft");
const getServerBuildAvailability_1 = require("../util/getServerBuildAvailability");
const getNextConfig_1 = __importDefault(require("../getNextConfig"));
const NextConfigBuilder_1 = __importDefault(require("./NextConfigBuilder"));
const config_1 = __importDefault(require("@edgio/core/config"));
const semver_1 = require("semver");
const resolve_1 = __importDefault(require("resolve"));
const constants_1 = require("../router/constants");
const getNextVersion_1 = __importDefault(require("../util/getNextVersion"));
/**
 * Creates a build entrypoint for a connector
 * @param param0
 */
function createBuildEntryPoint({ srcDir, distDir, buildCommand }) {
    const builder = new deploy_1.DeploymentBuilder(process.cwd());
    const srcDirAbsolute = path_1.join(process.cwd(), srcDir);
    const distDirAbsolute = path_1.join(process.cwd(), distDir);
    return async function build(options) {
        var _a;
        const { skipFramework } = options;
        const config = getNextConfig_1.default();
        const defaultLocale = (_a = config === null || config === void 0 ? void 0 : config.i18n) === null || _a === void 0 ? void 0 : _a.defaultLocale;
        builder.clearPreviousBuildOutput();
        if (!skipFramework) {
            await buildNextApp(srcDirAbsolute, distDirAbsolute, buildCommand, builder);
        }
        const { useServerBuild } = getServerBuildAvailability_1.getServerBuildAvailability({ config });
        const buildOutputDir = useServerBuild ? 'server' : 'serverless';
        const pagesDir = path_1.join(builder.jsDir, distDir, buildOutputDir, 'pages');
        const prerenderManifest = nonWebpackRequire_1.default(path_1.join(distDirAbsolute, 'prerender-manifest.json'));
        if (useServerBuild) {
            console.log('> Using Next standalone build...');
            await addStandaloneBuildAssets(distDir, builder);
        }
        else {
            console.log(`> Using Next ${config.target} build...`);
            await addLegacyBuildAssets(config.target, pagesDir, distDir, buildOutputDir, builder);
        }
        // builds the next.config.js file and add our config file handler
        const nextConfigBuilder = new NextConfigBuilder_1.default(builder, {
            useServerBuild,
            generateSourceMap: process.env.EDGIO_SOURCE_MAPS !== 'false',
            distDir,
        });
        await nextConfigBuilder.build();
        addSSGPages(path_1.join(distDirAbsolute, buildOutputDir, 'pages'), path_1.join(distDir, buildOutputDir, 'pages'), defaultLocale, prerenderManifest, builder);
        await builder
            .addJSAsset(path_1.join(distDirAbsolute, 'BUILD_ID')) // needed for NextRoutes
            .addJSAsset(path_1.join(distDirAbsolute, 'routes-manifest.json')) // needed for rewrites and redirects
            .addJSAsset(path_1.join(distDirAbsolute, 'prerender-manifest.json')) // needed for cache times
            .build();
        const nextVersion = getNextVersion_1.default();
        // Build optimizations for server build on Next 12, until Next13
        if (useServerBuild && nextVersion && semver_1.lt(nextVersion, '13.0.0')) {
            await optimizeAndCompileServerBuild(builder);
        }
        if (process.env.EDGIO_SOURCE_MAPS === 'false') {
            console.log(`> Found edgioSourceMaps set to false`);
            console.log(`> Deleting .map files from lambda folder`);
            builder.deleteMapFiles(builder.jsDir);
        }
    };
}
exports.default = createBuildEntryPoint;
/**
 * There is an issue with Next12 where their server source code is not bundled into single file.
 * This leads to very long cold starts on the platform ~5s+, with bundling everything into single
 * we are able to get under ~1s load time from the Lambda disk.
 *
 * We are not seeing these problems with Next 13
 * @param builder
 */
async function optimizeAndCompileServerBuild(builder) {
    var _a, _b;
    const nextServerFile = 'next-server.js';
    const outputFile = 'next-server-optimized.js';
    let nextPackageJson;
    try {
        nextPackageJson = require(path_1.join(process.cwd(), 'node_modules', 'next', 'package.json'));
    }
    catch (e) {
        await new Promise((resolve, reject) => {
            resolve_1.default('next', (err, res, pkg) => {
                if (err) {
                    reject(err);
                }
                else {
                    nextPackageJson = pkg;
                    resolve(res);
                }
            });
        });
    }
    // Dependencies from the next server which we don't want to bundle
    const externalDependencies = [
        ...Object.keys((_a = nextPackageJson.dependencies) !== null && _a !== void 0 ? _a : {}),
        ...Object.keys((_b = nextPackageJson.peerDependencies) !== null && _b !== void 0 ? _b : {}),
        // these files contain global variables which are set
        // and then loaded by other files in next folder
        '../shared/lib/runtime-config.js',
        './router',
        // Next 12
        'critters',
        //'next/dist/compiled/@edge-runtime/primitives/*',
        // Anything which is used for SSR rendering can't be easily bundled
        'styled-jsx',
        'react',
        'react-dom',
        'render',
        './render',
    ];
    const buildCommand = `npx esbuild ${nextServerFile} --target=es2018 --bundle --minify --platform=node --allow-overwrite --outfile=${outputFile} ${externalDependencies
        .map(l => `--external:${l}`)
        .join(' ')}`;
    const nextSourceFiles = path_1.join(builder.edgioDir, 'lambda', 'node_modules', 'next', 'dist', 'server');
    await builder.exec(buildCommand, { cwd: nextSourceFiles });
}
/**
 * Copies the output of the Next standalone build to the lambda dir.
 */
async function addStandaloneBuildAssets(distDir, builder) {
    const distDirAbsolute = path_1.join(process.cwd(), distDir);
    const { jsDir } = builder;
    // add the standalone app and dependencies
    builder.copySync(path_1.join(distDirAbsolute, 'standalone'), jsDir, {
        // exclude the server.js since we roll our own in prod.ts
        filter: (file) => file !== path_1.join(distDirAbsolute, 'standalone', 'server.js'),
    });
}
/**
 * Handles bundling the lambda for Next.js prior to 12.2.0. This includes both 'serverless' and 'experimental-serverless-trace'
 * targets.
 */
async function addLegacyBuildAssets(target, pagesDir, distDir, buildOutputDir, builder) {
    builder
        // React components and api endpoints
        .addJSAsset(path_1.join(distDir, buildOutputDir));
    if (target !== 'serverless') {
        // If the user has overridden the default target and is using serverless do not perform tracing for required node modules
        const pageHandlerFiles = globby_1.default
            .sync('**/*.js', {
            onlyFiles: true,
            cwd: pagesDir,
        })
            .map(file => {
            const src = path_1.join(pagesDir, file);
            return src;
        });
        const { fileList } = await nft_1.nodeFileTrace(pageHandlerFiles);
        fileList
            .filter(file => file.indexOf('node_modules') === 0)
            .forEach(file => builder.copySync(file, path_1.join(builder.edgioDir, 'lambda', file)));
    }
    const disableImageOptimizer = config_1.default.get('disableImageOptimizer', false);
    if (disableImageOptimizer) {
        console.warn("[Edgio] WARNING: This build target doesn't contain next image optimizer. All images will be unoptimized when Edgio image optimizer is disabled and other optimizer is not provided.");
    }
}
/**
 * Builds the Next app using the Next CLI
 */
async function buildNextApp(srcDir, distDir, buildCommand, builder) {
    // clear .next directory
    builder.emptyDirSync(distDir);
    validateNextConfig_1.default(srcDir);
    try {
        // run the next.js build
        await builder.exec(buildCommand);
    }
    catch (e) {
        throw new FrameworkBuildError_1.default('Next.js', buildCommand, e);
    }
}
/**
 * Move all static pages from the lambda dir to the s3 dir. We don't need them in the lambda
 * since we're serving them from s3. so that @edgio/core doesn't.  Also, having them be present
 * in the lambda will make NextRoutes add duplicate routes for each.
 */
function addSSGPages(srcDir, destDir, defaultLocale, prerenderManifest, builder) {
    builder.log(`Adding SSG pages from ${srcDir}`);
    // Add SSG pages with normalized paths
    // e.g. /path/to/page/index.html and /path/to/page/index.json
    globby_1.default
        .sync('**/*.{json,html}', {
        onlyFiles: true,
        ignore: ['**/*.nft.json'],
        cwd: srcDir,
    })
        .forEach(file => {
        const src = path_1.join(srcDir, file);
        let dest = path_1.join(destDir, file);
        if (!file.match(/index\.(html|json)$/)) {
            // Index files are a special case. "/" should map to "/index.html", not "/index/index.html"
            dest = path_1.join(destDir, file.replace(/\.(html|json)$/, '/index.$1'));
        }
        builder.addStaticAsset(src, dest);
        // Set TTL
        const key = '/' + file.replace(/\.(html|json)$/, '');
        const metadata = prerenderManifest.routes[key];
        if (metadata === null || metadata === void 0 ? void 0 : metadata.initialRevalidateSeconds) {
            builder.log(`Setting TTL of ${metadata.initialRevalidateSeconds} seconds for ${dest}`);
            builder.setStaticAssetExpiration(dest, metadata.initialRevalidateSeconds, constants_1.FAR_FUTURE_TTL);
            if (defaultLocale) {
                dest = dest.replace(new RegExp(`/${defaultLocale}/`), '/');
                builder.log(`Setting TTL of ${metadata.initialRevalidateSeconds} seconds for ${dest}`);
                builder.setStaticAssetExpiration(dest, metadata.initialRevalidateSeconds, constants_1.FAR_FUTURE_TTL);
            }
        }
    });
    if (defaultLocale) {
        // copy assets for the default locale to the root dir so they can be served without a locale
        builder.addStaticAsset(path_1.join(builder.staticAssetsDir, destDir, defaultLocale), destDir);
    }
}
