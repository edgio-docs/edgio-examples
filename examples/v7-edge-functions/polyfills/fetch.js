const _fetch = fetch;

export default function createFetch(origin) {
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
