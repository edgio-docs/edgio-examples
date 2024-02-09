/**
 * Creates a fetch function with an additional 'edgio' option to specify the origin.
 *
 * @param {string} originName - The origin name defined in edgio.config.js.
 * @returns {function} - A modified fetch function.
 * @throws {Error} If the origin name is not provided.
 */
export default function createFetchWithOrigin(originName: string) {
  if (!originName) {
    throw new Error(
      "'originName' is required and must be a name defined in edgio.config.js"
    );
  }

  return async (url: string | Request, options: any = {}) => {
    const edgio = options.edgio || {};
    delete options.edgio;

    const modifiedOptions = {
      ...options,
      edgio: {
        ...edgio,
        origin: originName,
      },
    };
    return fetch(url, modifiedOptions);
  };
}
