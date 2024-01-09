import '../../../utils/polyfills/URL';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';

export async function handleHttpRequest(request, context) {
  // ** IMPORTANT **
  // Secret key should be defined as an environment variable in the Edgio console
  const secretKey = '$0m3th!ngS3cr3t'; // contet.environmentVars.REQ_SIGNING_SECRET_KEY;

  return generateSignedUrl(new URL(request.url), secretKey);
}

async function generateSignedUrl(url, key) {
  // Replace /sign/ with /verify/ in the URL since we are generating a signed URL for verification
  url.pathname = url.pathname.replace('/sign/', '/verify/');

  // The link will expire in 5 minutes
  const expirationMs = 1000 * 60 * 5; // 5 minutes
  const expiry = Date.now() + expirationMs;
  const dataToAuthenticate = url.pathname + expiry;

  const hash = HmacSHA1(dataToAuthenticate, secretKey);
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
          <li><a href="${validUrl}">Valid URL</a><pre>(${validUrl})</pre></li>
          <li><a href="${modifiedExpiryUrl}">Invalid with modified Expiry URL</a><pre>(${modifiedExpiryUrl})</pre></li>
          <li><a href="${modifiedMacUrl}">Invalid with modified Mac URL</a><pre>(${modifiedMacUrl})</pre></li>
        </ul>
      </body>
    </html>
  `;

  return new Response(htmlResponse, {
    headers: { 'Content-Type': 'text/html' },
  });
}
