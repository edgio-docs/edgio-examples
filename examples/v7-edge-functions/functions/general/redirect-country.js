export async function handleHttpRequest(request, context) {
  const country = 'DE'; // Choose a country code
  const newUrl = `${request.url}/${country}`; // Change the redirect URL to your choice

  if (context.geo.country === country) {
    return new Response(null, {
      status: 302,
      statusText: 'Found',
      headers: {
        Location: newUrl,
      },
    });
  }

  return fetch(request.url, {
    edgio: { origin: 'echo' },
  });
}
