/**
 * Creates a fetch function with an additional 'edgio' option to specify the origin.
 *
 * @param {string} originName - The origin name defined in edgio.config.js.
 * @returns {function} - A modified fetch function.
 * @throws {Error} If the origin name is not provided.
 */
export default function createFetchWithOrigin(originName) {
  if (!originName) {
    throw new Error(
      "'originName' is required and must be a name defined in edgio.config.js"
    );
  }

  return (url, options = {}, ...rest) => {
    const modifiedOptions = {
      ...options,
      edgio: {
        origin: originName,
      },
    };
    return fetch(url, modifiedOptions, ...rest);
  };
}
