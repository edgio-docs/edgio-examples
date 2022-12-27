import { Router } from "@edgio/core/router";
import fallback from "./functions/fallback";
import hello from "./functions/hello";
import log from "./functions/log";

export default new Router()
  .get("/hello/:name", ({ compute, cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60, // cache at the edge for 1 hour
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365, // serve stale for one year
      },
    });
    compute(hello);
  })
  .post("/log", ({ compute }) => compute(log))
  .fallback(({ compute }) => compute(fallback));
