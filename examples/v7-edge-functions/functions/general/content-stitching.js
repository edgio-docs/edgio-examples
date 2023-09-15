import createFetchWithOrigin from '../../utils/createFetchForOrigin';

const fetch = createFetchWithOrigin('google');
const domain = 'https://www.google.com';

export async function handleHttpRequest(request, context) {
  const resp = await fetch(domain);
  let html = await resp.text();

  // update relative links
  const regex = /\b(href|src)\s*=\s*["']((?!https?:\/\/)[^"']+)/gi;
  html = html.replace(regex, `$1="${domain}$2"`);

  const marquee =
    '<marquee>This paragraph was injected by an edge function.</marquee>';
  html = html.replace(/(<center[^>]*>)/i, `$1${marquee}`);

  return new Response(html, resp);
}
