# Next.js Demo of Edgio Token Auth Functionality
This project demonstrates how Token Auth works with Edgio. For more details on this feature, visit [the docs](https://docs.edg.io/applications/v7/security/token_auth).

## Available Pages
This application exposes a few separate pages and one API endpoint:

* Main Page `/`: This page does not require a token.
* Token Auth Landing Page `/secure`: This page does not require a token. All links on this page require a valid token.
* Static Secure Page `/secure/static`: This page shows static data.
* Static Dynamic Page `/secure/dynamic`: This page shows dynamic data fetched from a third-party API.
* Token Generator/Decoder `/secure/generator`: This page allows the visitor to create and decode `ectoken`-compatible tokens.
* Current Token Information `/secure/info`: This page shows the decoded information about the token used to access the page.
* API route `/api/token`: This API route takes a `GET` request and returns a new token valid for all users but only for three minutes from when it was generated.

## How to Use
1. Navigate to the project homepage and click the link for the "Landing Page."
1. On the landing page, click the button to "Generate a temporary token."
1. Copy the generated token to your clipboard. Note that the links on this page will automatically update when a token is generated.
1. If you have generated a token via the client-side generator (see below), you can replace the token in the query string for any of the secure routes.

## Generating a Custom Token
You can also generate a custom token for this site. (Please note: the primary and backup tokens must be present in the Edgio environment variables for this feature to work properly.)
1. Navigate to the "Client-side Token Generator/Decoder" page.
1. Under the "Encode Token" section, enter the values you need for your token.
1. In that same section, enter one of the two keys you entered in your Token Auth settings for your Edgio environment.
1. Click "Encode Token."
1. The "Token value" field will contain the encoded token for your environment. Copy that token, and use it when navigating the demo site.