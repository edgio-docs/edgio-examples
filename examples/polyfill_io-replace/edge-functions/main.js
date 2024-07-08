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

  // Get the HTML from static test file and stream the response body through the HtmlTransformer
  return fetch('/polyfill.io-usage', { edgio: { origin: 'edgio_self' } }).then(
    (response) => HtmlTransformer.stream(transformerDefinitions, response)
  );

  // Use the following code to serve the original content from your origin server
  // return fetch(request.url, { edgio: { origin: 'my-origin' } }).then(
  //   (response) => HtmlTransformer.stream(transformerDefinitions, response)
  // );
}
