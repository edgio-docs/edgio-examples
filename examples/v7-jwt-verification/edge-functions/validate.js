import { JWT } from './JWT.js';

/**
 * Handle an HTTP request to validate a JWT.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {any} context - Context providing runtime information.
 * @returns {Response} HTTP response with validation result.
 */
export async function handleHttpRequest(request, context) {
  // Extract the JWT token from the request body
  const { token } = await request.json();

  // Retrieve the secret key from environment variables
  const secret = context.environmentVars['JWT_SECRET'] || 'your-256-bit-secret';

  // Initialize response structure
  const resp = { valid: false };

  // Create JWT instance with the token and secret
  const jwt = new JWT(token, secret);

  // Validate the JWT
  const isValid = jwt.validate();

  // If valid, update response with additional JWT info
  if (isValid) {
    resp.valid = true;
    resp.payload = jwt.payloadObject(); // Extract payload
    resp.alg = jwt.algUsed(); // Extract algorithm used
  }

  // Return the response with appropriate HTTP status code
  return new Response(JSON.stringify(resp), {
    status: isValid ? 200 : 403, // 200 OK for valid token, 403 Forbidden for invalid
    headers: { 'Content-Type': 'application/json' }, // Set response content type
  });
}
