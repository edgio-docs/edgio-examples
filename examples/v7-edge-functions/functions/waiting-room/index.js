import {
  getCookiesFromRequest,
  setCookieToResponse,
} from '../../utils/cookies';
import { setEnvFromContext } from '../../utils/polyfills/process.env';
import waitingPage from './waiting-room-capacity.html';
import landingPage from './waiting-room-landing.html';
import { COOKIE_NAME_ID, COOKIE_NAME_TIME } from './constants';
import { getSessionData } from './planetscale';

/**
 * Main handler for the edge request.
 */
export async function handleHttpRequest(request, context) {
  let response;

  // Set context environment variables to process.env
  setEnvFromContext(context);

  const cookies = getCookiesFromRequest(request);

  // Get user ID from cookie or generate a new one
  const sessionId = cookies[COOKIE_NAME_ID];

  // Get the current number of active sessions and the active user
  const { session, activeCount, queuedCount } = await getSessionData(sessionId);

  // Check capacity
  if (session.status === 'active') {
    response = await getDefaultResponse(request, session);
  } else {
    response = await getWaitingRoomResponse(request, session);
  }

  // Update the session cookie with the latest timestamp
  setSessionCookie(response, session.sessionId, session.updatedAt);

  return response;
}

/**
 * Handle the default response.
 */
async function getDefaultResponse(request, session) {
  const response = new Response(landingPage({ requestUrl: request.url }));
  response.headers.set('content-type', 'text/html;charset=UTF-8');

  return response;
}
/**
 * Response for the waiting room.
 */
async function getWaitingRoomResponse(request, session) {
  // update the waiting page to show the position in the queue, replacing {{queuePosition}}
  const body = waitingPage({
    queuePosition: session.position,
  });

  const response = new Response(body);
  response.headers.set('content-type', 'text/html;charset=UTF-8');

  return response;
}

/**
 * Sets the session cookie to the response.
 *
 * @param {Response} response
 * @param {Object} session
 * @param {number} date
 * @returns {Promise<void>}
 */
export async function setSessionCookie(response, sessionId, date) {
  const now = date || Date.now();

  setCookieToResponse(response, [[COOKIE_NAME_TIME, now.toString()]]);
  setCookieToResponse(response, [[COOKIE_NAME_ID, sessionId]]);
}
