import { re } from 'semver';
import {
  getCookiesFromRequest,
  setCookieToResponse,
} from '../../utils/cookies';
import { setEnvFromContext } from '../../utils/polyfills/process.env';
import '../../utils/polyfills/URL';
import {
  COOKIE_NAME_ID,
  COOKIE_NAME_TIME,
  ACTIVE_SESSION_DURATION_SECONDS,
  QUEUED_SESSION_DURATION_SECONDS,
} from './constants';
import { refreshSession } from './planetscale';
import { setSessionCookie } from '.';

export async function handleHttpRequest(request, context) {
  let resp;

  const redirectUrl = request.url.replace('/ping', '');
  const invalidResponse = Response.redirect(redirectUrl, 302);

  // Set context environment variables to process.env
  setEnvFromContext(context);

  const cookies = getCookiesFromRequest(request);

  // Redirect to the waiting room to establish a session
  if (!cookies[COOKIE_NAME_ID]) {
    return invalidResponse;
  }

  // Refresh the session
  const { sessionId, updatedAt } = await refreshSession(
    cookies[COOKIE_NAME_ID]
  );

  if (!sessionId) {
    return invalidResponse;
  }

  const response = new Response('pong');

  setSessionCookie(response, sessionId, updatedAt);

  return response;
}
