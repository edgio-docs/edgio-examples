import {
  createInstance,
  eventDispatcher,
} from '@optimizely/optimizely-sdk/dist/optimizely.lite.min.js';
import optimizelyDatafile from '../lib/optimizely/datafile.json';

const CLIENT_ENGINE = 'EDGIO_EF';
const COOKIE_NAME = 'optimizely_visitor_id';

/**
 * An example edge function which forwards the request to the origin.
 * See routes.js for how this function is configured to run for requests to "/".
 */

export async function handleHttpRequest(request, context) {
  // Fetch user Id from the cookie if available so a returning user from same browser session always sees the same variation.
  const userId =
    request.headers
      .get('Cookie')
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1] || `user-${new Date().getTime()}`;

  console.log(JSON.stringify(context, null, 2));
  const url = new URL('/', request.url);
  const resp = await fetch(url, {
    edgio: {
      origin: 'edgio_self',
    },
  });

  // handle the response as needed
  // For example, to inject some html into the body:
  const html = await resp.text();

  // Create Optimizely instance using datafile downloaded at build time.
  const instance = createInstance({
    datafile: optimizelyDatafile,
    clientEngine: CLIENT_ENGINE,
    eventDispatcher,
  });

  // Return the original HTML if the instance is not created.
  if (!instance) {
    return resp;
  }

  await instance.onReady();

  // Create Optimizely User Context
  const userContext = instance.createUserContext(userId.toString());

  // Decide variation for the flag.
  const decision = userContext.decide('foo_flag');

  console.log(`[OPTIMIZELY] userId: ${userId}`);
  console.log(
    `[OPTIMIZELY] flag 'foo_flag' is ${
      decision.enabled ? 'enabled' : 'disabled'
    } for the user ${userId}`
  );

  // To send the response to the client with the new HTML but the same headers as the origin response:
  return new Response(html, {
    ...resp,
    headers: {
      ...resp.headers,
      'x-edge-function': 'main.js',
    },
  });
}

// Check if setTimeout is already available (in case of running in an environment that has it)

let timers = new Map();
let nextTimerId = 1;

(function () {
  var timerQueue = [];
  var nextTimerId = 0;

  function runTimers() {
    var now = Date.now();
    var nextCheck = null;

    // Run due timers
    for (var i = 0; i < timerQueue.length; i++) {
      var timer = timerQueue[i];
      if (timer.time <= now) {
        timer.callback.apply(null, timer.args);
        if (timer.repeating) {
          timer.time = now + timer.delay; // schedule next run
          nextCheck =
            nextCheck !== null ? Math.min(nextCheck, timer.time) : timer.time;
        } else {
          timerQueue.splice(i--, 1); // remove non-repeating timer
        }
      } else {
        nextCheck =
          nextCheck !== null ? Math.min(nextCheck, timer.time) : timer.time;
      }
    }

    // Schedule next check
    if (nextCheck !== null) {
      var delay = Math.max(nextCheck - Date.now(), 0);
      setTimeout(runTimers, delay);
    }
  }

  global.setTimeout = function (callback, delay, ...args) {
    var timerId = ++nextTimerId;
    var timer = {
      id: timerId,
      callback: callback,
      time: Date.now() + delay,
      args: args,
      repeating: false,
      delay: delay,
    };
    timerQueue.push(timer);
    return timerId;
  };

  global.clearTimeout = function (timerId) {
    for (var i = 0; i < timerQueue.length; i++) {
      if (timerQueue[i].id === timerId) {
        timerQueue.splice(i, 1);
        break;
      }
    }
  };

  global.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch((err) =>
        setTimeout(() => {
          throw err;
        })
      );
  };

  setTimeout(runTimers, 0);
})();

//@ts-ignore

// export async function middleware(req: NextRequest, ev: NextFetchEvent) {
//   // Fetch user Id from the cookie if available so a returning user from same browser session always sees the same variation.
//   const userId = req.cookies.get(COOKIE_NAME)?.value || crypto.randomUUID()

//   // Create Optimizely instance using datafile downloaded at build time.
//   const instance = createInstance({
//     datafile: optimizelyDatafile,
//     clientEngine: VERCEL_EDGE_CLIENT_ENGINE,
//     eventDispatcher: {
//       dispatchEvent: ({ url, params }: { url: string; params: any }) => {
//         // Tell edge function to wait for this promise to fullfill.
//         ev.waitUntil(
//           fetch(url, {
//             method: 'POST',
//             body: JSON.stringify(params),
//           })
//         )
//       },
//     },
//   })

//   // Create Optimizely User Context
//   const userContext = instance!.createUserContext(userId.toString())

//   // Decide variation for the flag.
//   const decision = userContext!.decide('product_sort')

//   // Fetch datafile revision for debugging.
//   const revision = instance!.getOptimizelyConfig()!.revision

//   console.log(`[OPTIMIZELY] Datafile Revision: ${revision}`)
//   console.log(`[OPTIMIZELY] userId: ${userId}`)
//   console.log(
//     `[OPTIMIZELY] flag 'product_sort' is ${
//       decision.enabled ? 'enabled' : 'disabled'
//     } for the user ${userId}`
//   )
//   console.log(
//     `[OPTIMIZELY] User ${userId} was bucketed in to variation ${decision.variationKey}`
//   )
//   console.log(`[OPTIMIZELY] sort_method is ${decision.variables.sort_method}`)

//   // Rewriting the path based on sort_method. The default is Alphabetical.
//   req.nextUrl.pathname =
//     decision.variables.sort_method === 'popular_first' ? '/popular' : '/'
//   let res = NextResponse.rewrite(req.nextUrl)

//   if (!req.cookies.has(COOKIE_NAME)) {
//     // Saving userId in the cookie so that the decision sticks for subsequent visits.
//     res.cookies.set(COOKIE_NAME, userId)
//   }

//   return res
// }
