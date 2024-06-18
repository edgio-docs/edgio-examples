import { AwsV4Signer } from './lib/awsv4';

/**
 * This edge function signs an S3 request using the AWS v4 signature algorithm
 * and forwards the request to the S3 origin. Authentication credentials are
 * read from environment variables set in the Edgio Developer Console.
 */
export async function handleHttpRequest(request, context) {
  const { S3_HOSTNAME, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } =
    context.environmentVars;

  const initialUrl = new URL(request.url);

  // Remove the /s3 prefix from the path before signing since we only
  // want to sign the path relative to the bucket.
  const s3Path = initialUrl.pathname.replace(/^\/s3/, '');
  const s3Url = new URL(s3Path, `https://${S3_HOSTNAME}`);

  const signer = new AwsV4Signer({
    url: s3Url.href,
    method: request.method,
    region: S3_REGION,
    service: 's3',
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    signQuery: true,
  });

  const signedDetails = await signer.sign();

  return fetch(signedDetails.url, {
    method: signedDetails.method,
    headers: signedDetails.headers,
    edgio: {
      origin: 's3',
    },
  });
}
