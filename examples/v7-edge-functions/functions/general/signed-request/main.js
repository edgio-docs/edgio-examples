import { URL } from 'whatwg-url';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';
import createFetchForOrigin from '../../../utils/createFetchForOrigin';

const fetch = createFetchForOrigin('echo', {
  edgio: {
    caching: {
      bypass_cache: true,
    },
  },
});

export async function handleHttpRequest(request, context) {
  // ** IMPORTANT **
  // Secret key should be defined as an environment variable in the Edgio console
  const secretKey = '$0m3th!ngS3cr3t'; // context.environmentVars.REQ_SIGNING_SECRET_KEY;

  if (request.url.includes('/sign/')) {
    return generateSignedUrl(request, secretKey);
  }

  return verifyAndFetch(request, secretKey);
}

/**
 * Generates a signed URL for the given URL and secret key
 * @param {URL} url
 * @param {string} secretKey
 */
async function generateSignedUrl(request, key) {
  const url = new URL(request.url);

  // Replace /sign/ with /verify/ in the URL since we are generating a signed URL for verification
  url.pathname = url.pathname.replace('/sign/', '/verify/');

  const expirationMs = 1000 * 60 * 5; // 5 minutes
  const expiry = Date.now() + expirationMs;
  const dataToAuthenticate = url.pathname + expiry;

  const hash = HmacSHA1(dataToAuthenticate, key);
  const base64Mac = Base64.stringify(hash);

  url.searchParams.set('mac', base64Mac);
  url.searchParams.set('expiry', expiry.toString());

  const validUrl = url.toString();
  const modifiedExpiryUrl = new URL(validUrl);
  modifiedExpiryUrl.searchParams.set('expiry', `${expiry + 5}`);
  const modifiedMacUrl = new URL(validUrl);
  modifiedMacUrl.searchParams.set('mac', `${base64Mac}x`);

  console.log('Valid URL:\n', validUrl);
  console.log('Modified expiry URL:\n', modifiedExpiryUrl.toString());
  console.log('Modified MAC URL:\n', modifiedMacUrl.toString());

  const htmlResponse = `
    <html>
      <body>
        <p>Click the following links for verification:</p>
        <ul>
          <li><a href="${validUrl}">Valid request.</a><pre>(${validUrl})</pre></li>
          <li><a href="${modifiedExpiryUrl}">Invalid request due to a modified <code>expiry</code> parameter.</a><pre>(${modifiedExpiryUrl})</pre></li>
          <li><a href="${modifiedMacUrl}">Invalid request due to a modified <code>mac</code> parameter.</a><pre>(${modifiedMacUrl})</pre></li>
        </ul>
      </body>
    </html>
  `;

  return new Response(htmlResponse, {
    headers: { 'Content-Type': 'text/html' },
  });
}

/**
 * Verifies the MAC and expiry of the given URL. If the URL is valid, the request is forwarded to the origin.
 */
async function verifyAndFetch(request, key) {
  const invalidResponse = (reason) =>
    new Response(`Invalid request - ${reason}`, { status: 403 });
  const url = new URL(request.url);

  if (!url.searchParams.has('mac') || !url.searchParams.has('expiry')) {
    return invalidResponse('Missing MAC or expiry');
  }

  const expiry = Number(url.searchParams.get('expiry'));
  const dataToAuthenticate = url.pathname + expiry;

  const receivedMacBase64 = url.searchParams.get('mac');
  const receivedMac = Base64.parse(receivedMacBase64);

  const hash = HmacSHA1(dataToAuthenticate, key);
  const hashInBase64 = Base64.stringify(hash);

  // Ensure that the MAC is valid
  if (hashInBase64 !== receivedMacBase64) {
    return invalidResponse('Invalid MAC');
  }

  // Ensure that the URL has not expired
  if (Date.now() > expiry) {
    return invalidResponse('URL has expired');
  }

  // Forward the remaining request path after **/verify/* to the origin
  url.pathname = url.pathname.split('/verify/')[1];

  return fetch(url.toString());
}
