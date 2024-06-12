export async function handleHttpRequest(request, context) {
  // This definition replaces <esi:include src="..." /> the response from the src
  const transformerDefinitions = [
    {
      // This selector will match all <esi:include /> elements which have a src attribute.
      // We escape the : character with 2 backslashes to indicate it is part of the tag name
      // and not an attribute of the selector.
      selector: 'esi\\:include[src]',
      element: async (el) => {
        const url = el.get_attribute('src');
        const response = await fetch(url, { edgio: { origin: 'edgio_self' } });
        if (response.status == 200) {
          const body = await response.text();
          el.replace(body, 'html');
        } else {
          el.replace(
            '<a>We encountered an error, please try again later.</a>',
            'html'
          );
        }
      },
    },
  ];
  const textDecoder = new TextDecoder();

  // Set the URL to the esi_include.html we'll be transforming
  const esiIncludeSource = new URL(request.url);
  esiIncludeSource.pathname = '/assets/esi_include.html';

  // Get the HTML from the origin server and stream the response body through the
  // HtmlTransformer to the Response object
  const response = fetch(esiIncludeSource, { edgio: { origin: 'edgio_self' } })
    // Retrieve its body as ReadableStream
    .then(async (response) => {
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          const htmlTransformer = new HtmlTransformer(
            transformerDefinitions,
            (chunk) => {
              controller.enqueue(chunk);
            }
          );
          return pump();
          function pump() {
            return reader.read().then(async ({ done, value }) => {
              if (value) {
                await htmlTransformer.write(textDecoder.decode(value));
              }
              // When no more data needs to be consumed, close the stream
              if (done) {
                await htmlTransformer.end();
                controller.close();
                return;
              }
              // Send the html to the HtmlTransformer.
              return pump();
            });
          }
        },
      });
    })
    // Create a new response out of the stream
    .then((stream) => new Response(stream));

  return response;
}
