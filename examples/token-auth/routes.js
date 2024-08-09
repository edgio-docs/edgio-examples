// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core/router'
import { nextRoutes } from '@edgio/next'

export default new Router()
  .match(/^\/secure\/.+/i, {
    access: {
      token_auth: true
    }
  })

  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)

  .if(
    {
      edgeControlCriteria: {
        and: [
          { "=~": [{ request: "path" }, "(?i)^/secure/.+"] },
          { "===": [{ response: "status_code" }, "403"] },
        ],
      },
    },
    {
      response: {
        set_response_body:
          "<h1>403 - Access Denied</h1><p>Your request requires a valid token to proceed. Please append it to the URL and try again.</p><p><a href="./secure">Return to the Token Auth landing page.</a></p>",
        set_status_code: 403
      },
    }
  )
