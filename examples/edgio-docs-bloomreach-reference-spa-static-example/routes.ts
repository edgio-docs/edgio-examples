// This file was added by edgio init.
// You should commit this file to source control.

import { Router } from "@edgio/core/router";

// routes.js

const ONE_HOUR = 60 * 60;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_YEAR = 365 * ONE_DAY;

const edgeOnly = {
  browser: false,
  edge: { maxAgeSeconds: ONE_YEAR },
};

const edgeAndBrowser = {
  browser: { maxAgeSeconds: ONE_YEAR },
  edge: { maxAgeSeconds: ONE_YEAR },
};

export default new Router()
  .prerender([{ path: "/" }])
  .match("/api/:path*", ({ cache, proxy }) => {
    cache(edgeAndBrowser);
    proxy("origin", { path: "/delivery/site/v1/channels/brxsaas/pages/:path" });
  })
  .graphqlOperation(
    {
      path: "/graphql/:path*",
      name: "ItemsByCategory",
    },
    ({ proxy, cache }) => {
      cache(edgeAndBrowser);
      proxy("graphql", { path: "/:path" });
    }
  )
  .graphqlOperation(
    {
      path: "/graphql/:path*",
      name: "Category",
    },
    ({ proxy, cache }) => {
      cache(edgeAndBrowser);
      proxy("graphql", { path: "/:path" });
    }
  )
  .graphqlOperation(
    {
      path: "/graphql/:path*",
      name: "Item",
    },
    ({ proxy, cache }) => {
      cache(edgeAndBrowser);
      proxy("graphql", { path: "/:path" });
    }
  )
  .match("/graphql/:path*", ({ proxy }) => {
    proxy("graphql", { path: "/:path" });
  })
  .match("/images/:path*", ({ cache, proxy }) => {
    cache(edgeAndBrowser);
    proxy("origin");
  })
  .match("/service-worker.js", ({ serviceWorker }) =>
    serviceWorker("build/service-worker.js")
  )
  // match routes for js/css resources and serve the static files
  .match("/static/:path*", ({ serveStatic, cache }) => {
    cache(edgeAndBrowser);
    serveStatic("build/static/:path*");
  })
  // match client-side routes that aren't a static asset
  // and serve the app shell. client-side router will
  // handle the route once it is rendered
  .match("/:path*/:file([^\\.]+|)", ({ appShell, cache }) => {
    cache(edgeOnly);
    appShell("build/index.html");
  })
  // match other assets such as favicon, manifest.json, etc
  .match("/:path*", ({ serveStatic, cache }) => {
    cache(edgeOnly);
    serveStatic("build/:path*");
  })
  // send any unmatched request to origin
  .fallback(({ serveStatic }) => serveStatic("build/index.html"));
