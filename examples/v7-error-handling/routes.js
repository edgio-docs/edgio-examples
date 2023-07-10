// This file was automatically added by edgio deploy.
// You should commit this file to source control.
import { Router } from "@edgio/core/router";
import { nextRoutes } from "@edgio/next";

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)
  .get("/legacy/:path*", {
    origin: {
      // This will retry the request from the legacy origin if the primary origin returns a 5xx status code
      set_origin: "legacy",
    },
    url: {
      url_rewrite: [
        // strip the "/legacy" prefix from the path
        { source: "/legacy/(.*)", syntax: "regexp", destination: "/$1" },
      ],
    },
  })
  .catch(/^5.*/, {
    url: { follow_redirects: true },
    response: { set_status_code: 302 },
    headers: {
      set_response_headers: {
        location: "%{scheme}://%{host}/custom-error-page",
      },
    },
  })
  .match(
    // Redirect all 5xx responses to the same path with "/legacy" prepended (unless we already have a "/legacy" in the path)
    { response: { status_code: /^4.*/ } },
    {
      response: {
        set_status_code: 302,
      },
      url: {
        // This makes the redirect invisible to the client. They will just see the 500.html page.
        follow_redirects: true,
      },
      headers: {
        set_response_headers: {
          // Redirect to the same URL with "/legacy" prepended
          location:
            "%{scheme}://%{host}/legacy%{path}%{is_args}%{query_string}",
        },
      },
    }
  );
