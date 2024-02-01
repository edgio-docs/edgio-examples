import '../../utils/polyfills/URL';

export async function handleHttpRequest(request, context) {
  // Retrieve the client's IP address from the context object
  const clientIP = context.client.dst_addr;

  const newRequest = new Request(request.url, request);

  // Add the true-client-ip header to the incoming request
  newRequest.headers.set('true-client-ip', clientIP);

  // Continue with the modified request
  return fetch(newRequest, {
    edgio: { origin: 'echo' },
  });
}
