export default class NextPathFormatter {
    private nextConfig;
    /**
     * Provides formatting functions for next paths
     * @param nextConfig The configuration of next
     */
    constructor(nextConfig: any);
    /**
     * Removes extensions and index from next path
     *
     * @param pagePath The next page path, for example /products/[id]
     * @example
     * /index.js => /
     * /main.html => /main
     */
    toCleanPath: (pagePath: string) => string;
    /**
     * Converts next path to express route syntax
     * @example
     * /[param1]/[param2] => /:param1/:param2
     * /[...path] => /:path*
     * @param pagePath The next page path, for example /products/[id]
     * @param isDataRoute true if we are creating a route for a call to getStaticProps or getServerSideProps
     */
    toRouteSyntax: (pagePath: string, { suffix, locale }?: {
        suffix?: string | undefined;
        locale?: string | undefined;
    }) => string;
    localize(locales: string[], route: string): string;
}
