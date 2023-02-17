import Params from './Params';
/**
 * Converts path params captured by [...varName] from a single string (the format returned by Edgio's router)
 * to arrays split by "/" (the format that Next.js provides).
 * @param {String} page The page route path
 * @param {Object} params The params captured by Edgio router
 * @return {Object} A new params object
 */
export declare function convertSplatParamsToArray(page: string, params: Params): {
    [x: string]: string | string[];
};
