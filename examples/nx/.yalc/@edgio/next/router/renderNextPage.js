"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addPreloadHeaders_1 = __importDefault(require("@edgio/core/router/addPreloadHeaders"));
const constants_1 = require("@edgio/core/constants");
const nextPathFormatter_1 = __importDefault(require("./nextPathFormatter"));
const qs_1 = __importDefault(require("qs"));
const bindParamsToPath_1 = __importDefault(require("@edgio/core/utils/bindParamsToPath"));
const environment_1 = require("@edgio/core/environment");
const getServerBuildAvailability_1 = require("../util/getServerBuildAvailability");
const getNextConfig_1 = __importDefault(require("../getNextConfig"));
// The named export is user-facing while the default export is used internally.
// When Next 12 users that have opted into `server` target use this function they
// get a deprecation message once.
function renderNextPage(page, responseWriter, params, options = { rewritePath: true }) {
    if (!environment_1.isProductionBuild()) {
        const config = getNextConfig_1.default();
        const { useServerBuild } = getServerBuildAvailability_1.getServerBuildAvailability({ config });
        if (useServerBuild) {
            throw new Error('The use of `renderNextPage` is retired for use with a server target build. Use `renderWithApp()` instead.\n' +
                'More information: https://docs.edg.io/guides/next#section_next_js_version_12_and_next_js_middleware__beta_');
        }
    }
    return _renderNextPage(page, responseWriter, params, options);
}
exports.renderNextPage = renderNextPage;
/**
 * Creates a function that proxies a request to next.js.
 *
 *  new Router()
 *    .get('/some-vanity-url/:withVar', res => {
 *      res.cache({
 *        edge: {
 *          maxAgeSeconds: 60 * 60 // 1 hour
 *        }
 *      })
 *      return renderNextPage('/p/[productId]', res, (params, request) => ({ productId: params.withVar }))
 *    })
 *
 * @param page The next page route - for example /p/[productId]
 * @param responseWriter The response writer passed into your route handler
 * @param params An optional object containing query params to provide to the next page, or a function that takes the route's path params and the request and returns a params object.
 * @param options
 * @return Promise A promise that resolves when the response has been received from Next.js
 */
async function _renderNextPage(page, responseWriter, params, 
/* istanbul ignore next */
options = { rewritePath: true }) {
    const { request, proxy, updateUpstreamResponseHeader } = responseWriter;
    await proxy(constants_1.BACKENDS.js, {
        headers: {
            'x-next-page': page,
        },
        path: () => {
            // will get here when generating the cache manifest for prefetching
            let { query } = request;
            // params can be an object or a function
            if (typeof params === 'function') {
                params = params(request.params, request);
            }
            else if (!params) {
                params = request.params;
            }
            // here we override params on the incoming request with params specified by the developer
            // so that the developer can be sure that things like productId which they specify take precedence
            query = { ...query, ...params };
            let search = qs_1.default.stringify(query);
            if (search.length) {
                search = `?${search}`;
            }
            const nextConfig = getNextConfig_1.default();
            const path = options.rewritePath
                ? rewritePath(request, page, params, nextConfig)
                : request.path;
            return `${path}${search}`;
        },
        transformResponse: addPreloadHeaders_1.default,
    });
    // getServerSideProps adds cache-control: private by default, which prevents caching in Edgio.
    // If the user wants the responses to be truly private, they will need to add `cache({ browser: false })`
    // to their routes.
    updateUpstreamResponseHeader('cache-control', /(,\s*\bprivate\b\s*)|(^\s*private,\s*)/g, '');
}
exports.default = _renderNextPage;
/**
 * Rewrites the request path so that users can use renderNextPage to render a response
 * body using a page that doesn't match the request path.
 * @param request
 * @param page
 * @param params
 * @param nextConfig
 */
function rewritePath(request, page, params, nextConfig) {
    const nextPathFormatter = new nextPathFormatter_1.default(nextConfig);
    let destinationRoute = nextPathFormatter.toRouteSyntax(page);
    if (request.path && request.path.startsWith('/_next/data/')) {
        destinationRoute = `/_next/data/:__build__/${destinationRoute.replace(/^\//, '')}.json`;
    }
    return bindParamsToPath_1.default(destinationRoute, params);
}
