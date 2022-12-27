# Layer0 + brX SaaS + React = 💜

Reference SPA using the Bloomreach Experience [React SDK](https://www.npmjs.com/package/@bloomreach/react-sdk).
The app is created using [create-react-app](https://github.com/facebook/create-react-app).
Deployed on [Layer0](https://docs.layer0.co/guides/bloomreach)

## Guide

Read the full [guide](https://docs.layer0.co/guides/bloomreach) on Layer0

## Install and run

Copy `.env.dist` file to `.env` and specify the brX SaaS instance to fetch the page model from:

```bash
REACT_APP_BRXM_ENDPOINT: https://layer0-docs-bloomreach-layer0-example-saas-default.layer0-limelight.link/api
BRXM_ENDPOINT: trial-tnk8sgqr.bloomreach.io
REACT_APP_GRAPHQL_SERVICE_URL: https://layer0-docs-bloomreach-layer0-example-saas-default.layer0-limelight.link/graphql
GRAPHQL_SERVICE_URL: graphql.trial-tnk8sgqr.bloomreach.io
```

Then, build and run the React app as follows:

```bash
npm ci
npm start
```

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open <http://localhost:3000> to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm deploy`

Deploys the app to Layer0. Make sure you have the Layer0 CLI installed (`npm i -g @layer0/cli`).
