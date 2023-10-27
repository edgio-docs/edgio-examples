import createFetchForOrigin from '../../utils/createFetchForOrigin';
import '../../utils/polyfills/URL';

const fetch = createFetchForOrigin('echo');

export async function handleHttpRequest(request, context) {
  const { method } = request;
  const body = method === 'POST' ? await request.arrayBuffer() : null;

  // get the headers from the incoming request, removing the content-length header
  const headers = Object.fromEntries(
    [...request.headers.entries()].filter(([key]) => key !== 'content-length')
  );

  const newRequest = new Request('https://http-echo.raees.me', {
    method,
    headers,
    body,
  });

  const response = await fetch(newRequest);

  // apply caching headers to the response for all HTTP methods
  response.headers.set('cache-control', 's-maxage=600');

  return response;
}
