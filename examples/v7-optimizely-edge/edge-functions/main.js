import '../lib/polyfills'; // Necessary polyfills for the edge function scope
import {
  createInstance,
  eventDispatcher,
} from '@optimizely/optimizely-sdk/dist/optimizely.lite.min.js';
import optimizelyDatafile from '../lib/optimizely/datafile.json';
import { v4 as uuidv4 } from 'uuid';

// Constants for Optimizely client configuration
const CLIENT_ENGINE = 'EDGIO_EF';
const COOKIE_NAME = 'optimizely_visitor_id';

/**
 * Handles incoming HTTP requests and applies A/B testing using Optimizely.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} context - The context for this handler
 * @returns {Response} The HTTP response after applying A/B testing logic.
 */
export async function handleHttpRequest(request, context) {
  console.log(JSON.stringify(request.headers, null, 2)); // Log request headers for debugging

  // Retrieve or generate a unique user ID from cookies
  const userId =
    request.headers
      .get('Cookie')
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1] || uuidv4();

  // Create an Optimizely instance with the preloaded datafile and configuration
  const instance = createInstance({
    datafile: optimizelyDatafile,
    clientEngine: CLIENT_ENGINE,
    eventDispatcher,
  });

  // Early exit if the Optimizely instance isn't properly created
  if (!instance) {
    return new Response('Optimizely instance unavailable.', { status: 500 });
  }

  await instance.onReady(); // Ensures the Optimizely instance is ready before proceeding

  // Create a user context for the retrieved or generated user ID
  const userContext = instance.createUserContext(userId.toString());

  // Make a decision using Optimizely for the 'text_direction' feature
  const decision = userContext.decide('text_direction');
  const textDir = decision.enabled ? 1 : -1; // Determine text direction based on decision

  console.log(`[OPTIMIZELY] User ID: ${userId}, Text Direction: ${textDir}`);

  // Fetch the homepage of Wikipedia
  const url = new URL('https://en.wikipedia.org');
  const response = await fetch(url.toString(), {
    edgio: { origin: 'wikipedia' },
  });

  // Update the `<body>` tag with the text direction based on the Optimizely decision
  const bodyTagRegex = /<body([^>]*)>/i;
  const bodyTagReplacement = `<body style="transform: scaleX(${textDir});"$1>`;
  const body = await response.text();
  const updatedBody = body.replace(bodyTagRegex, bodyTagReplacement);

  // Create a new response with the updated body content
  const updatedResponse = new Response(updatedBody, response);

  // Add the user ID to the response headers as a cookie to ensure the user experience consistency
  // const cookie = `${COOKIE_NAME}=${userId}; Path=/; Max-Age=31536000; SameSite=Lax`;
  // updatedResponse.headers.append('Set-Cookie', cookie);

  return updatedResponse;
}
