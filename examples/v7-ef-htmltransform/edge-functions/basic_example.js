export async function handleHttpRequest(request, context) {
  const transformerDefinitions = [
    // This first definition replaces http with https in the <a href=...> elements
    {
      // This selector will match all <a> elements which have an href attribute
      selector: 'a[href]',
      element: async (el) => {
        const href = el.get_attribute('href');
        el.set_attribute('href', href.replace('http://', 'https://'));
      },
    },

    // This second definition removes all comments from the <body>
    {
      selector: 'body',
      comment: async (c) => {
        // remove the comment
        c.remove();
      },
    },

    // This third definition appends a timestamp to the end of the HTML document
    {
      // Since this operates on the document, there is no need to specify a selector
      doc_end: async (d) => {
        // Use the append() method to append the timestamp to the end of the document
        // Specify 'html' as the second arguemnt to indicate the content is HTML, not plain text
        d.append(
          `<!-- Transformed at ${new Date().toISOString()} by Edg.io -->`,
          'html'
        );
      },
    },
  ];

  // Set the URL to the basic.html we'll be transforming
  const basicHtmlSource = new URL(request.url);
  basicHtmlSource.pathname = '/assets/basic.html';

  // Get the HTML from the origin server and stream the response body through the HtmlTransformer
  return fetch(basicHtmlSource, { edgio: { origin: 'edgio_self' } }).then(
    (response) => {
      let transformedResponse = HtmlTransformer.stream(
        transformerDefinitions,
        response
      );
      // Make any changes to the response headers here.
      transformedResponse.headers.set('x-html-transformer-ran', 'true');
      return transformedResponse;
    }
  );
}
