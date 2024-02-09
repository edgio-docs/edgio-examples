export async function handleHttpRequest(request, context) {
  const upstreamResponse = await fetch(
    'https://edgio-functions-dummy-json-default.edgio.link/products/1',
    {
      edgio: { origin: 'dummy-json' },
    }
  );
  upstreamResponse.headers.set('x-functions-power', '9001');

  return upstreamResponse;
}
