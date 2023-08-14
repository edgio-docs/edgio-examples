const _fetch = fetch;

export default function createFetch(origin) {
  if (!origin)
    throw new Error(
      `'origin' is required and must be a name defined in edgio.config.js`
    );

  return (url, options, ...rest) => {
    return _fetch(
      url,
      {
        ...options,
        edgio: {
          origin,
        },
      },
      ...rest
    );
  };
}
