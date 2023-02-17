import PluginBase from '@edgio/core/plugins/PluginBase';
import ResponseWriter from '@edgio/core/router/ResponseWriter';
import RouteGroup from '@edgio/core/router/RouteGroup';
import Router from '@edgio/core/router/Router';
export default class NextRoutes extends PluginBase {
    private nextRouteGroupName;
    private nextRootDir;
    private pagesDir;
    private pagesDirRelative;
    private router?;
    private rewrites?;
    private redirects?;
    private locales;
    private routesManifest;
    private distDir;
    private defaultLocale?;
    private renderMode;
    private ssr;
    private localizationEnabled;
    private buildId;
    private prerenderManifest;
    private previewModeId;
    private nextConfig;
    private enforceTrailingSlash;
    private nextPathFormatter;
    type: string;
    /**
     * Provides next registered routes to router
     * @param nextRootDir The root directory for the Next.js app
     */
    constructor(nextRootDir?: string);
    /**
     * Set this to true to honor Next's internal redirects that either add or remove a trailing slash
     * depending on the value of the `trailingSlash` config. By default these internal redirects are not
     * honored so that sites that fallback to serving from an origin do not add or remove the trailing slash
     * for origin URLs.
     * @param value
     */
    setEnforceTrailingSlash(value: boolean): void;
    /**
     * Returns the contents of .next/BUILD_ID
     */
    private getBuildId;
    /**
     * Returns the contents of routes-manifest.json
     */
    private getRoutesManifest;
    /**
     * Attempt to get rewrites and redirects from routes-manifest.json in production.
     */
    private loadRewrites;
    /**
     * Returns the contents of pages-manifest.json
     */
    private getPagesManifest;
    /**
     * Returns the content of app-paths-manifest.json
     * and changes the format of keys to correct URLs
     */
    private getAppPathsManifest;
    /**
     * Returns the contents of middleware-manifest.json
     */
    private getMiddlewareManifest;
    /**
     * Returns the contents of prerender-manifest.json
     */
    private getPrerenderManifest;
    /**
     * Attempt to get rewrites and redirects from the next config in development.
     */
    private loadRewritesInDev;
    /**
     * Called when plugin is registered
     * @param router The router to which the plugin has been added.
     */
    onRegister(router: Router): void;
    /**
     * Update routes
     */
    private updateRoutes;
    /**
     * Adds next routes to route group.
     * @param group The RouteGroup to which Next.js routes should be added.
     */
    private addNextRoutesToGroup;
    /**
     * Adds the route for server assets such as the middleware manifest
     * @param group
     */
    private addServerAssets;
    /**
     * Creates a Edgio RouteCriteria from path and has attributes found in rewrites in redirects
     * in next.config.js.
     * @param path The path pattern
     * @param has Has elements from next.config.js rewrites and redirects.
     * @returns
     */
    private createRouteCriteria;
    /**
     * Find an existing route that would match a request with destination as the path - we will run its handler when
     * the request's path matches the rewrite source.
     * @param group The route group
     * @param source The source URL
     * @param has Any has elements
     * @param destination The destination URL
     */
    private addRewrite;
    /**
     * Finds a backend in edgio.config.js that has the same hostname as the specified rewrite destination URL.
     * @param urlStr
     * @returns
     */
    private backendForDestination;
    private addRewrites;
    /**
     * Adds rewrites and redirects from next.config.js
     * @param group The group to which to add redirect routes
     */
    private addRedirects;
    /**
     * Adds routes for all pages and corresponding data in development
     * @param group The group to which to add page routes
     */
    private addPagesInDev;
    private startsWithLocale;
    /**
     * Adds a route for each middleware that forces the edge to send the request to serverless so
     * that middleware runs.
     * @param group
     */
    /**
     * Adds routes for react components and API handlers
     * @param group The group to which to add page routes
     */
    private addPagesInProd;
    /**
     * Returns true if the specified page was statically rendered at build time (no getServerSideProps or getInitialProps)
     * @param prerenderManifest The prerender-manifest.json file
     * @param pagesManifest the pages-manifest.json file
     * @param page The page key
     * @returns
     */
    private isPrerendered;
    /**
     * Removes the locale part from the start of path
     * @param path E.g /en-US/p/[id]
     * @returns the path minus the locale, e.g /p/[id]
     */
    private removeLocale;
    /**
     * Automatically configure prerendering to pull all SSG pages into the edge cache.
     * This only needs to be done during a production build.
     */
    private addPrerendering;
    /**
     * Production route handler for all dynamic HTML and JSON requests (SSR and SSG).
     * @param page The next.js page to render
     */
    private createSSRHandler;
    /**
     * Returns true if a page with getStaticProps is configured to fallback to SSR
     * Specifically, this function returns true if dynamicRouteConfig.fallback is null (fallback: 'blocking') or a string (fallback: true)
     * @param dynamicRouteConfig
     * @returns
     */
    private shouldFallbackToSSR;
    /**
     * Creates a handler for SSG pages that can be optionally configured with fallback: tredgiodfdue
     * @param relativeAssetPath The asset path relative to .next/serverless
     * @param options
     */
    private createSSGHandler;
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
    render404(res: ResponseWriter): Promise<void>;
    private _render404;
    /**
     * Adds routes for static assets, including /public and /.next/static
     * @param group The RouterGroup to which asset routes should be added
     */
    private addAssets;
    /**
     * Adds routes for edgio image-optimizer when app run in production mode
     * @param group The RouterGroup to which image optimizer routes should be added
     */
    addEdgioImageOptimizerRoutes(group: RouteGroup): void;
    /**
     * Adds route for next image-optimizer when app run in production mode
     * @param group The RouterGroup to which routes should be added
     */
    addNextImageOptimizerRoutes(group: RouteGroup): void;
    /**
     * Adds leading basePath property from next.config.js to path
     * in case it's specified
     * @param path
     */
    addBasePath(path: string): string;
}
/**
 * Sort static routes before dynamic routes
 * @param pages Page paths
 * @param routesManifest The routes manifest generated by Next's build
 */
export declare function sortRoutes(pages: string[], routesManifest: any): string[];
