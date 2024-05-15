import '../lib/polyfills';
import {
  createInstance,
  eventDispatcher,
} from '@optimizely/optimizely-sdk/dist/optimizely.lite.min.js';
import optimizelyDatafile from '../lib/optimizely/datafile.json';
import { v4 } from 'uuid';

const CLIENT_ENGINE = 'EDGIO_EF';
const COOKIE_NAME = 'optimizely_visitor_id';

export async function handleHttpRequest(request, context) {
  const userId =
    request.headers
      .get('Cookie')
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1] || v4();

  // Create Optimizely instance using datafile downloaded at build time.
  const instance = createInstance({
    datafile: optimizelyDatafile,
    clientEngine: CLIENT_ENGINE,
    eventDispatcher,
  });

  // Return the original HTML if the instance is not created.
  if (!instance) {
    return Response.error('Optimizely instance unavailable.');
  }

  await instance.onReady();

  const userContext = instance.createUserContext(userId.toString());
  const decision = userContext.decide('text_direction');
  const textDir = decision['enabled'] ? 'rtl' : 'ltr';

  console.log(
    `[OPTIMIZELY] User ID: ${userId}, Text Direction: ${textDir}, Decision: ${JSON.stringify(
      decision
    )}`
  );

  const url = new URL('/', request.url);
  url.searchParams.set('dir', textDir);
  const resp = await fetch(url, {
    edgio: {
      origin: 'edgio_self',
    },
  });

  return resp;
}
