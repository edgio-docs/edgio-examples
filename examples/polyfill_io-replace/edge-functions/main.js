export async function handleHttpRequest(request, context) {
  const baseReplacementUrl = 'https://cdnjs.cloudflare.com';
  const srcPrefixes = [
    'https://polyfill.io',
    'http://polyfill.io',
    '//polyfill.io',
  ];

  const transformerDefinitions = srcPrefixes.map((prefix) => ({
    selector: `script[src^="${prefix}"]`,
    element: async (el) => {
      const src = el.get_attribute('src');
      el.set_attribute('src', src.replace(prefix, baseReplacementUrl));
    },
  }));

  // Serve the origin response, transforming the HTML content to replace the polyfill.io script tag(s)
  return fetch(request.url, { edgio: { origin: 'my-origin' } }).then(
    (response) => HtmlTransformer.stream(transformerDefinitions, response)
  );
}
