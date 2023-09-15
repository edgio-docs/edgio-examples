const UrlRegex =
  /(?<scheme>https?):\/\/(?<hostname>(?:\w|\.|-)+)(?::(?<port>\d{2,5}))?/g;

export async function handleHttpRequest(request, context) {
  const urlMatch = UrlRegex.exec(request.url);
  if (!urlMatch.groups) {
    return context.respondWith(new Response('Invalid URL', { status: 400 }));
  }
  const upstreamResponse = await fetch(
    `${urlMatch[0]}/assets/tears-of-steel.m3u`,
    {
      edgio: {
        origin: 'edgio_static',
      },
    }
  );
  const manifestBody = await upstreamResponse.text();
  const lines = manifestBody
    .split('\n')
    .filter((line, index, lines) => !lines[index - 1]?.includes('1680x750'))
    .filter((line) => !line.includes('1680x750'));

  const modifiedResponse = new Response(lines.join('\n'), {
    headers: { 'content-type': upstreamResponse.headers.get('content-type') },
  });

  return modifiedResponse;
}
