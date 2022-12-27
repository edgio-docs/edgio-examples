import { Router } from "@edgio/core";
import { nextRoutes } from "@edgio/next";

export default new Router()
  .match("/service-worker.js", ({ serviceWorker }) => {
    return serviceWorker(".next/static/service-worker.js");
  })
  .match("/protected/static", ({ verifyJwt }) => {
    verifyJwt({
      algo: "HS256",
      cookie: "next-auth.session-token",
      secret: "secret",
      redirectInvalid: "/api/auth/signin",
      redirectExpiredAbsent: "/api/auth/signin",
    });
  })
  .match("/_next/data/:version/protected/:page*", ({ verifyJwt }) => {
    verifyJwt({
      algo: "HS256",
      cookie: "next-auth.session-token",
      secret: "secret",
      redirectInvalid: "/api/auth/signin",
    });
  })
  .use(nextRoutes); // automatically adds routes for all files under /pages
