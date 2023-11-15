// Asynchronous function to handle HTTP requests at the edge.
export async function handleHttpRequest(request) {
  // Check the request method and get the request body as an ArrayBuffer if it's not a GET or HEAD request.
  const requestBody = !['GET', 'HEAD'].includes(request.method)
    ? await request.arrayBuffer()
    : undefined;

  // Perform a fetch request to the original request URL with the same method, headers, and body.
  // Specify the 'edgio_serverless' as the origin to fetch the original Cloud Functions response.
  console.log('fetch', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    body: requestBody,
  });
  const cloudFunctionsResponse = await fetch(request.url, {
    edgio: { origin: 'edgio_serverless' },
    method: request.method,
    headers: request.headers,
    body: requestBody,
  });

  // Convert the response to text format.
  let responseText = await cloudFunctionsResponse.text();

  // Replace certain phrases in the response text to indicate processing by Edge Functions.
  responseText = responseText.replace(/cloud functions/i, 'Edge Functions');
  responseText = responseText.replace(/rendered by/i, 'changed by');

  // Return a new response with the modified text and original response status, status text, and headers.
  return new Response(responseText, {
    status: cloudFunctionsResponse.status,
    statusText: cloudFunctionsResponse.statusText,
    headers: cloudFunctionsResponse.headers,
  });
}
