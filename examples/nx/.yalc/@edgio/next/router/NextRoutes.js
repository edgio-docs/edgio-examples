"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@edgio/core/constants");
const environment_1 = require("@edgio/core/environment");
const nextPathFormatter_1 = __importDefault(require("./nextPathFormatter"));
const fs_1 = require("fs");
const getDistDir_1 = __importDefault(require("../util/getDistDir"));
const nonWebpackRequire_1 = __importDefault(require("@edgio/core/utils/nonWebpackRequire"));
const path_1 = require("path");
const PluginBase_1 = __importDefault(require("@edgio/core/plugins/PluginBase"));
const renderNextPage_1 = __importDefault(require("./renderNextPage"));
const constants_2 = require("./constants");
const watch_1 = __importDefault(require("@edgio/core/utils/watch"));
const config_1 = __importDefault(require("@edgio/core/config"));
const getServerBuildAvailability_1 = require("../util/getServerBuildAvailability");
const getNextConfig_1 = __importDefault(require("../getNextConfig"));
const slash_1 = __importDefault(require("slash"));
const FAR_FUTURE_CACHE_CONFIG = {
    browser: {
        maxAgeSeconds: constants_2.FAR_FUTURE_TTL,
    },
    edge: {
        maxAgeSeconds: constants_2.FAR_FUTURE_TTL,
    },
};
const PUBLIC_CACHE_CONFIG = {
    edge: {
        maxAgeSeconds: constants_2.FAR_FUTURE_TTL,
    },
};
const TYPE = 'NextRoutes';
class NextRoutes extends PluginBase_1.default {
    /**
     * Provides next registered routes to router
     * @param nextRootDir The root directory for the Next.js app
     */
    constructor(nextRootDir = '.') {
        var _a, _b, _c, _d;
        super();
        this.nextRouteGroupName = 'next_routes_group';
        this.locales = [];
        this.localizationEnabled = false;
        this.buildId = 'dev';
        this.enforceTrailingSlash = false;
        this.type = TYPE;
        this.nextRootDir = nextRootDir;
        this.pagesDirRelative = 'pages';
        this.pagesDir = path_1.join(process.cwd(), this.nextRootDir, this.pagesDirRelative);
        this.distDir = getDistDir_1.default();
        this.renderMode = 'serverless';
        this.nextConfig = getNextConfig_1.default();
        this.nextPathFormatter = new nextPathFormatter_1.default(this.nextConfig);
        this.ssr = (res, page, _forceRevalidate) => {
            return renderNextPage_1.default(page, res, params => params, {
                rewritePath: false,
            });
        };
        const { useServerBuild } = getServerBuildAvailability_1.getServerBuildAvailability({ config: this.nextConfig });
        if (useServerBuild) {
            this.renderMode = 'server';
            this.ssr = (res, _page, forceRevalidate) => {
                if (forceRevalidate && this.previewModeId) {
                    // This needs to be set in order to force Next server to render ISG pages. Without this it will
                    // always return the fallback (loading) page
                    res.setRequestHeader('x-prerender-revalidate', this.previewModeId);
                }
                return res.proxy(constants_1.BACKENDS.js, {
                    transformResponse(res) {
                        // If we see Cache-Control: {REMOVE_HEADER_VALUE} here, which is set before the request is handled by prod.ts,
                        // we know that the user did not explicitly set a Cache-Control header. This prevents Next.js from
                        // adding Cache-Control: private, no-cache, no-store by default, which would disable caching at the edge unless
                        // the user adds forcePrivateCaching: true to their routes. This was the default behavior prior to switching to the
                        // Next.js standalone build. We preserve that legacy behavior here to err on the side of caching, which keeps the customer's
                        // site fast and costs low.
                        if (res.getHeader('Cache-Control') === constants_2.REMOVE_HEADER_VALUE) {
                            res.removeHeader('Cache-Control');
                        }
                    },
                });
            };
        }
        if (!fs_1.existsSync(this.pagesDir)) {
            this.pagesDirRelative = path_1.join('src', 'pages');
            this.pagesDir = path_1.join(process.cwd(), this.nextRootDir, this.pagesDirRelative);
        }
        if (environment_1.isProductionBuild() || environment_1.isCloud()) {
            this.routesManifest = this.getRoutesManifest();
            this.buildId = this.getBuildId();
            this.locales = ((_a = this.routesManifest.i18n) === null || _a === void 0 ? void 0 : _a.locales) || [];
            this.defaultLocale = (_b = this.routesManifest.i18n) === null || _b === void 0 ? void 0 : _b.defaultLocale;
            this.localizationEnabled = this.locales.length > 0;
            this.prerenderManifest = this.getPrerenderManifest();
            this.previewModeId = (_d = (_c = this.prerenderManifest) === null || _c === void 0 ? void 0 : _c.preview) === null || _d === void 0 ? void 0 : _d.previewModeId;
            this.loadRewrites();
        }
        else {
            this.loadRewritesInDev().then(() => {
                if (this.rewrites || this.redirects) {
                    this.updateRoutes();
                }
            });
        }
    }
    /**
     * Set this to true to honor Next's internal redirects that either add or remove a trailing slash
     * depending on the value of the `trailingSlash` config. By default these internal redirects are not
     * honored so that sites that fallback to serving from an origin do not add or remove the trailing slash
     * for origin URLs.
     * @param value
     */
    setEnforceTrailingSlash(value) {
        this.enforceTrailingSlash = value;
    }
    /**
     * Returns the contents of .next/BUILD_ID
     */
    getBuildId() {
        const buildIdFile = path_1.join(process.cwd(), this.distDir, 'BUILD_ID');
        return fs_1.readFileSync(buildIdFile, 'utf8');
    }
    /**
     * Returns the contents of routes-manifest.json
     */
    getRoutesManifest() {
        const routesManifestPath = process.env.NEXT_ROUTES_MANIFEST_PATH ||
            path_1.join(process.cwd(), this.distDir, 'routes-manifest.json');
        return nonWebpackRequire_1.default(routesManifestPath);
    }
    /**
     * Attempt to get rewrites and redirects from routes-manifest.json in production.
     */
    loadRewrites() {
        const { rewrites, redirects } = this.routesManifest;
        this.rewrites = rewrites;
        this.redirects = redirects;
    }
    /**
     * Returns the contents of pages-manifest.json
     */
    getPagesManifest() {
        return nonWebpackRequire_1.default(path_1.join(process.cwd(), this.distDir, this.renderMode, 'pages-manifest.json'));
    }
    /**
     * Returns the content of app-paths-manifest.json
     * and changes the format of keys to correct URLs
     */
    getAppPathsManifest() {
        const location = path_1.join(process.cwd(), this.distDir, this.renderMode, 'app-paths-manifest.json');
        if (!fs_1.existsSync(location))
            return {};
        const appPaths = nonWebpackRequire_1.default(location);
        let appPathsOutput = {};
        // Removes the /page from path
        Object.keys(appPaths).forEach((key) => {
            let editedPath = key.substring(0, key.lastIndexOf('/page'));
            editedPath = editedPath.length === 0 ? '/' : editedPath;
            appPathsOutput = {
                ...appPathsOutput,
                [editedPath]: appPaths[key],
            };
        });
        return appPathsOutput;
    }
    /**
     * Returns the contents of middleware-manifest.json
     */
    getMiddlewareManifest() {
        const path = path_1.join(process.cwd(), this.distDir, this.renderMode, 'middleware-manifest.json');
        if (fs_1.existsSync(path)) {
            return nonWebpackRequire_1.default(path);
        }
        else {
            return {
                sortedMiddleware: [],
                middleware: {},
            };
        }
    }
    /**
     * Returns the contents of prerender-manifest.json
     */
    getPrerenderManifest() {
        const path = path_1.join(process.cwd(), this.distDir, 'prerender-manifest.json');
        try {
            return nonWebpackRequire_1.default(path);
        }
        catch (e) {
            if (process.env.DEBUG === 'true') {
                console.log(`${path} not found`);
            }
            return {};
        }
    }
    /**
     * Attempt to get rewrites and redirects from the next config in development.
     */
    async loadRewritesInDev() {
        // @ts-ignore
        const app = global.EDGIO_NEXT_APP;
        let nextConfig = app.nextConfig;
        if (!nextConfig) {
            nextConfig = await app.loadConfig();
        }
        /* istanbul ignore if */
        if (!nextConfig) {
            return;
        }
        const rewritesFn = nextConfig.rewrites;
        if (rewritesFn) {
            this.rewrites = await rewritesFn();
        }
        const redirectsFn = nextConfig.redirects;
        if (redirectsFn) {
            this.redirects = await redirectsFn();
        }
    }
    /**
     * Called when plugin is registered
     * @param router The router to which the plugin has been added.
     */
    onRegister(router) {
        this.router = router;
        /* create route group and add all next routes into it */
        this.router.group(this.nextRouteGroupName, group => this.addNextRoutesToGroup(group));
        this.router.fallback(res => this._render404(res));
        if (!environment_1.isProductionBuild()) {
            watch_1.default(this.pagesDir).on('all', () => this.updateRoutes());
        }
    }
    /**
     * Update routes
     */
    updateRoutes() {
        var _a, _b, _c;
        /* istanbul ignore next */
        const routeGroup = ((_c = (_b = (_a = this.router) === null || _a === void 0 ? void 0 : _a.routeGroups) === null || _b === void 0 ? void 0 : _b.findByName(this.nextRouteGroupName)) === null || _c === void 0 ? void 0 : _c.clear());
        this.addNextRoutesToGroup(routeGroup);
    }
    /**
     * Adds next routes to route group.
     * @param group The RouteGroup to which Next.js routes should be added.
     */
    addNextRoutesToGroup(group) {
        var _a, _b, _c, _d;
        if (environment_1.isProductionBuild()) {
            console.debug('');
            console.debug(`Next.js routes (locales: ${((_a = this.locales) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'none'})`);
            console.debug('--------------');
        }
        this.addRedirects(group);
        this.addRewrites((_b = this.rewrites) === null || _b === void 0 ? void 0 : _b.beforeFiles, group);
        this.addAssets(group);
        const disableImageOptimizer = config_1.default.get('disableImageOptimizer', false);
        if (!disableImageOptimizer) {
            this.addEdgioImageOptimizerRoutes(group);
        }
        if (disableImageOptimizer && this.nextConfig.target === 'server') {
            this.addNextImageOptimizerRoutes(group);
        }
        this.addRewrites((_c = this.rewrites) === null || _c === void 0 ? void 0 : _c.afterFiles, group);
        if (environment_1.isProductionBuild()) {
            this.addServerAssets(group);
            this.addPagesInProd(group);
            this.addPrerendering();
        }
        else {
            this.addPagesInDev(group);
        }
        const fallbackRewrites = ((_d = this.rewrites) === null || _d === void 0 ? void 0 : _d.fallback) || this.rewrites;
        if (Array.isArray(fallbackRewrites)) {
            this.addRewrites(fallbackRewrites, group);
        }
        if (environment_1.isProductionBuild()) {
            console.debug('--------------\n');
        }
    }
    /**
     * Adds the route for server assets such as the middleware manifest
     * @param group
     */
    addServerAssets(group) {
        // Note: we don't include /.next/server/pages here because we explicitly copy those over during
        // the build process (see createBuildEntryPoint.ts)
        group.match(this.addBasePath('/_next/server/:file'), ({ serveStatic, cache }) => {
            cache({ edge: { maxAgeSeconds: constants_2.FAR_FUTURE_TTL } });
            serveStatic(`${this.distDir}/${this.renderMode}/:file`);
        });
        group.match(this.addBasePath('/_next/server/chunks/:file'), ({ serveStatic, cache }) => {
            cache({ edge: { maxAgeSeconds: constants_2.FAR_FUTURE_TTL } });
            serveStatic(`${this.distDir}/${this.renderMode}/chunks/:file`);
        });
        // static assets required by next 13
        const assets = ['app-build-manifest.json', 'build-manifest.json'];
        assets.forEach(asset => {
            if (!fs_1.existsSync(`${this.distDir}/${asset}`))
                return;
            group.match(this.addBasePath(`/_next/${asset}`), ({ serveStatic, cache }) => {
                cache({ edge: { maxAgeSeconds: constants_2.FAR_FUTURE_TTL } });
                serveStatic(`${this.distDir}/${asset}`);
            });
        });
    }
    /**
     * Creates a Edgio RouteCriteria from path and has attributes found in rewrites in redirects
     * in next.config.js.
     * @param path The path pattern
     * @param has Has elements from next.config.js rewrites and redirects.
     * @returns
     */
    createRouteCriteria(path, has) {
        // Next.js adds /:nextInternalLocale(...) at the start of the source route - if we leave this in
        // the actually requests from the browser will never match.
        let criteria = path.replace(/\/:nextInternalLocale[^/]+/, '');
        if (has) {
            let headers = {};
            let cookies = {};
            let query = {};
            for (let el of has) {
                if (typeof el.value === 'string' && el.value.match(/\(\?<[^>]+>/)) {
                    throw new Error('Edgio does not yet support capturing named parameters in `has` elements of `rewrites` or `redirects` in next.config.js.');
                }
                if (el.type === 'header') {
                    headers[el.key] = el.value ? new RegExp(el.value) : /.*/;
                }
                else if (el.type === 'host') {
                    headers.host = new RegExp(el.value);
                }
                else if (el.type === 'cookie') {
                    cookies[el.key] = el.value ? new RegExp(el.value) : /.*/;
                }
                else if (el.type === 'query') {
                    query[el.key] = el.value ? new RegExp(el.value) : /.*/;
                }
                else {
                    console.warn(`Warning: has.type ${el.type} is not supported by Edgio`);
                }
            }
            return {
                path: criteria,
                headers: Object.keys(headers).length ? headers : undefined,
                cookies: Object.keys(cookies).length ? cookies : undefined,
                query: Object.keys(query).length ? query : undefined,
            };
        }
        else {
            return criteria;
        }
    }
    /**
     * Find an existing route that would match a request with destination as the path - we will run its handler when
     * the request's path matches the rewrite source.
     * @param group The route group
     * @param source The source URL
     * @param has Any has elements
     * @param destination The destination URL
     */
    addRewrite(group, source, has, destination) {
        // Next.js adds /:nextInternalLocale at the start of the destination route - if we leave this in
        // we'll never find the destination route
        let normalizedDestination = destination.replace(/\/:nextInternalLocale[^/]*/, '');
        if (this.defaultLocale) {
            // Use the defaultLocale in place of the the :locale parameter since we restrict the locale to only the
            // configured locales. If we don't do this, we'll never find the destination route.
            normalizedDestination = normalizedDestination.replace(/:locale/, this.defaultLocale);
        }
        if (environment_1.isProductionBuild()) {
            console.debug(`[rewrite] ${source} => ${normalizedDestination}`);
        }
        if (destination.match(/^https?:\/\//)) {
            const url = new URL(destination);
            const backend = this.backendForDestination(url);
            if (backend) {
                // proxy
                group.match(this.createRouteCriteria(source, has), ({ proxy }) => {
                    proxy(backend, { path: url.pathname });
                });
            }
            else {
                console.warn(`No matching backend was found in edgio.config.js for rewrite to ${url.toString()}. ` +
                    `To fix this problem, add key to the backends config with the following value: { "domainOrIp": "${url.hostname}" }. ` +
                    `See https://docs.edg.io/guides/edgio_config#section_backends for more information.`);
            }
        }
        else {
            // render
            group.match(this.createRouteCriteria(source, has), res => {
                const destRoute = group.routes.find(route => {
                    return route.match({ path: normalizedDestination });
                });
                if (destRoute) {
                    // need to extract the params again based on the new path
                    res.rewrite(destination, destRoute.criteria.path);
                    destRoute.handler(res);
                }
                else {
                    console.warn(`No matching route found for rewrite ${source} => ${destination}`);
                }
            });
        }
    }
    /**
     * Finds a backend in edgio.config.js that has the same hostname as the specified rewrite destination URL.
     * @param urlStr
     * @returns
     */
    backendForDestination(url) {
        const backends = config_1.default.get('backends', {});
        const entry = Object.entries(backends).find(([_key, value]) => value.domainOrIp === url.hostname);
        if (entry) {
            return entry[0];
        }
    }
    addRewrites(rewrites, group) {
        if (rewrites) {
            for (let { source, destination, has } of rewrites) {
                this.addRewrite(group, source, has, destination);
            }
        }
    }
    /**
     * Adds rewrites and redirects from next.config.js
     * @param group The group to which to add redirect routes
     */
    addRedirects(group) {
        if (this.redirects) {
            for (let { source, has, statusCode, destination, internal } of this.redirects) {
                // next < 10 did not have the internal property
                const isInternalRedirect = internal || source === '/:path+/';
                if (isInternalRedirect && !this.enforceTrailingSlash) {
                    continue;
                }
                if (isInternalRedirect) {
                    // For Next's internal redirects, which either add or remove the trailing slash, depending on the value of the trailingSlash config,
                    // we need to ensure that the route matches the entire path or these redirects will cause an infinite loop.
                    source += '($)';
                }
                const criteria = this.createRouteCriteria(source, has);
                group.match(criteria, ({ redirect }) => {
                    redirect(destination, { statusCode: statusCode || 302 });
                });
                console.log('[redirect]', criteria, 'to', destination);
            }
        }
    }
    /**
     * Adds routes for all pages and corresponding data in development
     * @param group The group to which to add page routes
     */
    addPagesInDev(group) {
        const nextHandler = (res) => res.proxy(constants_1.BACKENDS.js);
        // data,
        group.dir(this.pagesDirRelative, {
            ignore: ['_*'],
            paths: (file) => {
                let route = this.nextPathFormatter.toRouteSyntax(file);
                if (route.endsWith('/')) {
                    route += 'index';
                }
                return [`/_next/data/:build${route}.json`];
            },
            handler: () => nextHandler,
        });
        // SSR,
        group.dir(this.pagesDirRelative, {
            ignore: ['_*'],
            paths: (file) => [this.nextPathFormatter.toRouteSyntax(file)],
            handler: () => nextHandler,
        });
    }
    startsWithLocale(path) {
        return this.localizationEnabled && new RegExp(`^/(${this.locales.join('|')})(/|$)`).test(path);
    }
    /**
     * Adds a route for each middleware that forces the edge to send the request to serverless so
     * that middleware runs.
     * @param group
     */
    // TODO uncomment this when we support RegExp as route critera
    // private addMiddlewareInProd(group: RouteGroup) {
    //   const manifest = this.getMiddlewareManifest()
    //
    //   for (let key of manifest.sortedMiddleware) {
    //     const { regexp } = manifest.middleware[key]
    //     group.match(new RegExp(regexp), res => this.ssr(res, '', false))
    //   }
    // }
    /**
     * Adds routes for react components and API handlers
     * @param group The group to which to add page routes
     */
    addPagesInProd(group) {
        const { routesManifest, locales, localizationEnabled, prerenderManifest } = this;
        const pagesManifest = { ...this.getPagesManifest(), ...this.getAppPathsManifest() };
        const pagesWithDataRoutes = new Set(routesManifest.dataRoutes.map((route) => route.page));
        const addRoute = (label, route, handler) => {
            // Add trailing slash at the end of route when is set trailingSlash to true,
            // route is not root path and neither data path
            if (this.nextConfig.trailingSlash &&
                route !== '/' &&
                !/(.*)\/_next\/data\/(.*).json/.test(route)) {
                route += '/';
            }
            route = this.addBasePath(route);
            console.debug(`[${label}]`, route);
            group.match(route, handler);
        };
        // TODO uncomment this when we support RegExp as route critera
        // this.addMiddlewareInProd(group)
        const pages = sortRoutes(Object.keys(pagesManifest), routesManifest);
        for (let page of pages) {
            const path = this.nextPathFormatter.toRouteSyntax(page);
            const isPrerendered = this.isPrerendered(prerenderManifest, pagesManifest, page);
            if (page.match(/\/(_app|_document|_error|404|500)$/)) {
                // skip templates
            }
            else if (page.startsWith('/api')) {
                // api routes
                addRoute('api', path, res => this.ssr(res, page.slice(1)));
            }
            else if (this.startsWithLocale(page) && !page.startsWith(`/${this.defaultLocale}`)) {
                // When the app uses internationalization, we collapse all localized routes into a single
                // route to save router spacer, so for example en-US/sale and fr/sale become /:locale(en-US|fr)?/category/sale
            }
            else if (isPrerendered) {
                // SSG
                const dynamicRouteConfig = prerenderManifest.dynamicRoutes[page];
                const renderType = this.shouldFallbackToSSR(dynamicRouteConfig) ? 'ISG' : 'SSG';
                const nonLocalizedPath = this.startsWithLocale(path) ? this.removeLocale(path) : path;
                const nonLocalizedPage = this.startsWithLocale(page) ? this.removeLocale(page) : page;
                if (pagesWithDataRoutes.has(page)) {
                    // JSON
                    addRoute(`${renderType} json`, `/_next/data/:__build__${this.nextPathFormatter.localize(locales, this.nextPathFormatter.toRouteSyntax(nonLocalizedPath, { suffix: 'json' }))}`, this.createSSGHandler(nonLocalizedPage, {
                        dataRoute: true,
                        localize: localizationEnabled,
                        dynamicRouteConfig,
                    }));
                }
                // HTML
                addRoute(`${renderType} html`, this.nextPathFormatter.localize(locales, this.nextPathFormatter.toRouteSyntax(nonLocalizedPath)), this.createSSGHandler(nonLocalizedPage, {
                    localize: localizationEnabled,
                    dynamicRouteConfig,
                }));
            }
            else {
                // SSR
                if (pagesWithDataRoutes.has(page)) {
                    // will not get here when the page uses getInitialProps
                    addRoute('SSR json', `/_next/data/:__build__${this.nextPathFormatter.localize(locales, this.nextPathFormatter.toRouteSyntax(page, { suffix: 'json' }))}`, this.createSSRHandler(page));
                }
                // SSR: getServerSideProps or getInitialProps
                addRoute('SSR html', this.nextPathFormatter.localize(locales, this.nextPathFormatter.toRouteSyntax(page)), this.createSSRHandler(page));
            }
        }
    }
    /**
     * Returns true if the specified page was statically rendered at build time (no getServerSideProps or getInitialProps)
     * @param prerenderManifest The prerender-manifest.json file
     * @param pagesManifest the pages-manifest.json file
     * @param page The page key
     * @returns
     */
    isPrerendered(prerenderManifest, pagesManifest, page) {
        const file = pagesManifest[page];
        const htmlPagesPath = path_1.join(this.distDir, this.renderMode, 'pages', `${page}.html`);
        const htmlAppPath = path_1.join(this.distDir, this.renderMode, 'app', `${page}.html`);
        let routeKey = (this.defaultLocale ? `/${this.defaultLocale}` : '') + `${page}`;
        if (routeKey !== '/') {
            routeKey = routeKey.replace(/\/$/, '');
        }
        return (file.endsWith('.html') ||
            prerenderManifest.routes[routeKey] != null ||
            prerenderManifest.dynamicRoutes[page] != null ||
            fs_1.existsSync(htmlPagesPath) ||
            fs_1.existsSync(htmlAppPath));
    }
    /**
     * Removes the locale part from the start of path
     * @param path E.g /en-US/p/[id]
     * @returns the path minus the locale, e.g /p/[id]
     */
    removeLocale(path) {
        const [_, _locale, ...rest] = path.split('/');
        return '/' + rest.join('/');
    }
    /**
     * Automatically configure prerendering to pull all SSG pages into the edge cache.
     * This only needs to be done during a production build.
     */
    addPrerendering() {
        const { routes } = this.prerenderManifest;
        const requests = [];
        for (let htmlPath in routes) {
            requests.push({ path: htmlPath });
            requests.push({ path: `/_next/data/${this.buildId}${htmlPath}.json` });
        }
        const router = this.router;
        router.prerender(requests);
    }
    /**
     * Production route handler for all dynamic HTML and JSON requests (SSR and SSG).
     * @param page The next.js page to render
     */
    createSSRHandler(page) {
        // Note, we do not need to look up revalidate times from prerender-manifest.json
        // because Next automatically set cache-control: s-maxage=(revalidate), stale-while-revalidate
        return (res) => this.ssr(res, page.slice(1));
    }
    /**
     * Returns true if a page with getStaticProps is configured to fallback to SSR
     * Specifically, this function returns true if dynamicRouteConfig.fallback is null (fallback: 'blocking') or a string (fallback: true)
     * @param dynamicRouteConfig
     * @returns
     */
    shouldFallbackToSSR(dynamicRouteConfig) {
        if (dynamicRouteConfig) {
            return (dynamicRouteConfig.fallback === null /* fallback: 'blocking' */ ||
                typeof dynamicRouteConfig.fallback === 'string' /* fallback: true */);
        }
        else {
            return false;
        }
    }
    /**
     * Creates a handler for SSG pages that can be optionally configured with fallback: tredgiodfdue
     * @param relativeAssetPath The asset path relative to .next/serverless
     * @param options
     */
    createSSGHandler(relativeAssetPath, { dataRoute, localize, dynamicRouteConfig, }) {
        const suffix = dataRoute ? 'json' : 'html';
        const assetRoot = `${this.distDir}/${this.renderMode}/pages${localize ? '/:locale' : ''}`;
        const { prerenderManifest } = this;
        let destPath;
        if (dynamicRouteConfig || dataRoute) {
            // convert [param] to :param so that we can find the corresponding file on S3
            destPath = `${assetRoot}${this.nextPathFormatter.toRouteSyntax(relativeAssetPath)}/index.${suffix}`;
        }
        else {
            // leave [param] intact because routing will be done on the client
            destPath = `${assetRoot}${slash_1.default(relativeAssetPath)}/index.html`;
        }
        destPath = destPath.replace(/\/+/g, '/'); // remove duplicate "/"'s
        return (res) => {
            if (dynamicRouteConfig) {
                // will get here if the page has route params
                let loadingPage = undefined;
                const { fallback } = dynamicRouteConfig;
                if (!dataRoute && fallback) {
                    loadingPage = `${assetRoot}${fallback}`.replace(/\.html$/, '/index.html');
                }
                // Note that the cache TTL is stored as a header on S3 based on the prerender-manifest.json,
                // so we don't need to use res.cache() here.
                res.serveStatic(destPath, {
                    loadingPage,
                    disableAutoPublish: true,
                    onNotFound: () => {
                        const isPrerendered = prerenderManifest.routes[res.request.path];
                        // Note that fallback: 'blocking' in getStaticPaths results in fallback: null in prerender-manifest.json
                        if (this.shouldFallbackToSSR(dynamicRouteConfig) || isPrerendered || dataRoute) {
                            // Fallback to SSR when fallback: true is set in getStaticPaths or when revalidating a prerendered page or when it's a data path
                            return this.ssr(res, relativeAssetPath, true);
                        }
                        else {
                            // Render the custom 404 when a static page is not found.
                            return this._render404(res);
                        }
                    },
                });
            }
            else {
                // will get here if the page does not have route params
                res.serveStatic(destPath, {
                    disableAutoPublish: true,
                    onNotFound: () => this.ssr(res, relativeAssetPath, true),
                });
            }
        };
    }
    /**
     * Renders the the 404 page.
     *
     * Example:
     *
     * ```js
     *  import { nextRoutes } from '@edgio/next'
     *  import { Router } from '@edgio/core/router'
     *
     *  export default new Router()
     *    .get('/some/missing/page', (res) => {
     *      nextRoutes.render404(res)
     *    })
     *    .use(nextRoutes)
     * ```
     *
     * @param res The ResponseWriter to use to send the response
     */
    async render404(res) {
        // This method is retired for use with a server build. _render404 kept for internal use and backwards
        // compatibility with older versions using this method.
        /* istanbul ignore if */
        if (this.renderMode === 'server') {
            throw new Error('The use of `NextRoutes.render404` is retired for use with a server target build.\n' +
                'More information: https://docs.edg.io/guides/next#section_next_js_version_12_and_next_js_middleware__beta_');
        }
        else {
            await this._render404(res);
        }
    }
    async _render404(res) {
        var _a;
        if (environment_1.isCloud()) {
            const locale = (_a = res.request.params) === null || _a === void 0 ? void 0 : _a.locale;
            let prefix = '';
            if (locale) {
                prefix = `/${locale}`;
            }
            else if (this.defaultLocale) {
                prefix = `/${this.defaultLocale}`;
            }
            const pagesManifest = this.getPagesManifest();
            const key = `${prefix}/404`;
            const notFoundPage = pagesManifest[key];
            const assetRoot = `${this.distDir}/${this.renderMode}/pages`;
            if (notFoundPage && notFoundPage.endsWith('.html')) {
                // static 404
                await res.serveStatic(`${assetRoot}${key}/index.html`, {
                    statusCode: 404,
                    statusMessage: 'Not Found',
                });
            }
            else {
                // dynamic 404
                res.response.statusCode = 404;
                res.response.statusMessage = 'Not Found';
                await this.ssr(res, '404');
            }
        }
        else {
            return this.ssr(res, '404');
        }
    }
    /**
     * Adds routes for static assets, including /public and /.next/static
     * @param group The RouterGroup to which asset routes should be added
     */
    addAssets(group) {
        // public assets
        group.static(path_1.join(this.nextRootDir, 'public'), {
            handler: (file) => (res) => res.cache(PUBLIC_CACHE_CONFIG),
        });
        // webpack hot loader
        if (!environment_1.isCloud()) {
            group.match(this.addBasePath('/_next/webpack-hmr'), ({ stream }) => stream('__js__'));
        }
        const staticHandler = ({ proxy, serveStatic, cache }) => {
            if (environment_1.isCloud() || environment_1.isProductionBuild()) {
                cache(FAR_FUTURE_CACHE_CONFIG);
                serveStatic(`${this.distDir}/static/:path*`, {
                    permanent: true,
                    exclude: [path_1.join(this.distDir, 'static', 'service-worker.js')],
                });
            }
            else {
                proxy(constants_1.BACKENDS.js);
            }
        };
        // browser js
        // Notes:
        // - Assets with unique hashed filenames like JS, Css, and media are stored
        //   in a persistent bucket to be available across builds
        // - We can't apply that rule to the whole /static folder as it contains
        //   non-unique filenames like 'service-worker.js'. This will
        group.match(this.addBasePath('/_next/static/:path*'), staticHandler);
        group.match(this.addBasePath('/autostatic/:path*'), staticHandler);
    }
    /**
     * Adds routes for edgio image-optimizer when app run in production mode
     * @param group The RouterGroup to which image optimizer routes should be added
     */
    addEdgioImageOptimizerRoutes(group) {
        // Add route to exclude svg images from image optimization
        group.match({
            path: this.addBasePath('/_next/image'),
            method: /GET/i,
            query: { url: /\.svg/ },
        }, ({ proxy }) => {
            if (!environment_1.isProductionBuild())
                return;
            // Due to way how older next versions are serving SVG files
            // we need to tell optimizer to exclude all svg files to prevent converting them to WEBP
            proxy(constants_1.BACKENDS.imageOptimizer, { path: `${constants_1.EDGIO_IMAGE_OPTIMIZER_PATH}?u=true` });
        });
        // We replace '/_next/image' the '/__edgio_image_optimizer'
        // so Edgio Buffer Proxy can route to the right lambda in the cloud.
        group.match(this.addBasePath('/_next/(image|future/image)'), ({ proxy }) => {
            if (!environment_1.isProductionBuild())
                return;
            proxy(constants_1.BACKENDS.imageOptimizer, { path: constants_1.EDGIO_IMAGE_OPTIMIZER_PATH });
        });
    }
    /**
     * Adds route for next image-optimizer when app run in production mode
     * @param group The RouterGroup to which routes should be added
     */
    addNextImageOptimizerRoutes(group) {
        // We need to transform relative image paths to absolute to force next/image optimizer in server built to fully work.
        // This route is used when our image optimizer is disabled
        group.match(this.addBasePath('/_next/(image|future/image)'), ({ proxy }) => {
            if (!environment_1.isProductionBuild())
                return;
            proxy(constants_1.BACKENDS.js, {
                transformRequest: req => {
                    const protocol = req.secure ? 'https://' : 'http://';
                    // The request will be proxied to the same host on local
                    // Deployed app will use permalink host from EDGIO_IMAGE_OPTIMIZER_HOST
                    const hostname = environment_1.isLocal() ? req.headers['host'] : process.env.EDGIO_IMAGE_OPTIMIZER_HOST;
                    const url = new URL(req.url, `${protocol}${hostname}`);
                    const imgUrl = url.searchParams.get('url');
                    // ignore absolute paths
                    if (!imgUrl || imgUrl.startsWith('http'))
                        return;
                    url.searchParams.set('url', `${protocol}${hostname}${imgUrl}`);
                    req.url = `${url.pathname}?${url.searchParams.toString()}`;
                },
            });
        });
    }
    /**
     * Adds leading basePath property from next.config.js to path
     * in case it's specified
     * @param path
     */
    addBasePath(path) {
        if (!this.nextConfig.basePath)
            return path;
        if (path === '/' && !this.nextConfig.trailingSlash)
            return this.nextConfig.basePath;
        return `${this.nextConfig.basePath}${path}`.replace('//', '/');
    }
}
exports.default = NextRoutes;
/**
 * Sort static routes before dynamic routes
 * @param pages Page paths
 * @param routesManifest The routes manifest generated by Next's build
 */
function sortRoutes(pages, routesManifest) {
    const isDynamic = (page) => routesManifest.dynamicRoutes.find((r) => r.page === page);
    const indexFor = (page) => routesManifest.dynamicRoutes.findIndex((r) => r.page === page);
    let staticRoutes = [], dynamicRoutes = [];
    for (let page of pages) {
        if (isDynamic(page)) {
            dynamicRoutes.push(page);
        }
        else {
            staticRoutes.push(page);
        }
    }
    // Dynamic routes are ordered by priority (least dynamic to most dynamic)
    // in the routes-manifest.js file. Follow the same order for edgio routes.
    dynamicRoutes.sort((pageA, pageB) => {
        return indexFor(pageA) - indexFor(pageB);
    });
    return staticRoutes.concat(dynamicRoutes);
}
exports.sortRoutes = sortRoutes;
