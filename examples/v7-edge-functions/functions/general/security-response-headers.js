export async function handleHttpRequest(request, context) {
  // Fetch the response from the 'echo' origin
  const response = await fetch(new Request(request.url, request), {
    edgio: {
      origin: 'echo',
    },
  });

  // Set HTTP security headers
  response.headers.set(
    'strict-transport-security',
    'max-age=63072000; includeSubdomains; preload'
  );
  response.headers.set(
    'content-security-policy',
    "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'"
  );
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-xss-protection', '1; mode=block');
  response.headers.set('referrer-policy', 'same-origin');

  // Return the response to the client
  return response;
}
