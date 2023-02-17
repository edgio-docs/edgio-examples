import ResponseWriter from '@edgio/core/router/ResponseWriter';
import Request from '@edgio/core/router/Request';
import Params from './Params';
export declare function renderNextPage(page: string, responseWriter: ResponseWriter, params?: Params | ((p: Params, request: Request) => Params), options?: RenderOptions): Promise<void>;
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
export default function _renderNextPage(page: string, responseWriter: ResponseWriter, params?: Params | ((p: Params, request: Request) => Params), options?: RenderOptions): Promise<void>;
export interface RenderOptions {
    /**
     * Set to false to skip path rewriting. Use this only when Edgio route matches the next.js route.
     * This slightly reduces the amount of work that needs to be done on every request.
     */
    rewritePath: boolean;
}
