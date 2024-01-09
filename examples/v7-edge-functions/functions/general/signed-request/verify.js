import '../../../utils/polyfills/URL';
import { setEnvFromContext } from '../../../utils/polyfills/process.env';
import createFetchForOrigin from '../../../utils/createFetchForOrigin';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

const fetch = createFetchForOrigin('echo');

export async function handleHttpRequest(request, context) {
  // Set environment variables from the request context
  setEnvFromContext(context);

  return verifyAndFetch(new Request(request.url, request));
}

async function verifyAndFetch(request) {
  // ** IMPORTANT **
  // Secret key should be defined as an environment variable in the Edgio console
  const secretKey = '$0m3th!ngS3cr3t'; // process.env.REQ_SIGNING_SECRET_KEY;

  const url = new URL(request.url);

  if (!url.searchParams.has('mac') || !url.searchParams.has('expiry')) {
    return new Response('Missing query parameter', { status: 403 });
  }

  const expiry = Number(url.searchParams.get('expiry'));
  const dataToAuthenticate = url.pathname + expiry;

  const receivedMacBase64 = url.searchParams.get('mac');
  const receivedMac = Base64.parse(receivedMacBase64);

  const hash = HmacSHA256(dataToAuthenticate, secretKey);
  const hashInBase64 = Base64.stringify(hash);

  if (hashInBase64 !== receivedMacBase64) {
    return new Response(
      JSON.stringify(
        {
          message: 'Invalid MAC',
          hashInBase64,
          receivedMacBase64,
        },
        null,
        2
      ),
      { status: 403 }
    );
  }

  if (Date.now() > expiry) {
    const body = `URL expired at ${new Date(expiry)}`;
    return new Response(body, { status: 403 });
  }

  // Forward the remaining request path after **/verify/* to the origin
  url.pathname = url.pathname.split('/verify/')[1];

  return fetch(url.toString());
}
