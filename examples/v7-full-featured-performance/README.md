# A Full-Featured Edgio Application Performance Example

This full-featured example demonstrates what to expect when running our [Getting Started](https://docs.edg.io/guides/getting_started) command with the addition of static asset caching, which can be found in the route.js file.

## Implemented Features

* [Multiple origins proxying](https://docs.edg.io/guides/v7/performance/cdn_as_code/route_features#proxying-an-origin)
* [StaleWhileRevalidate](https://docs.edg.io/guides/v7/performance/caching#cache-hit-ratio-optimization) additional cache buffer
* [Prefetching](https://docs.edg.io/guides/v7/performance/prefetching)
* [Deepfetching](https://docs.edg.io/guides/v7/performance/prefetching#deep-fetching)
* [Image Optimization](https://docs.edg.io/guides/v7/performance/image_optimization)
* [Response Transformation with Serverless](https://docs.edg.io/guides/v7/performance/serverless_compute)
* [Header Manipulation](https://docs.edg.io/guides/v7/performance/cdn_as_code/route_features#altering-the-response)
* [Cache Key Normalization](https://docs.edg.io/guides/v7/performance/caching#customizing-the-cache-key)
* [DevTools](https://docs.edg.io/guides/v7/performance/observability/devtools)
* [RUM script injection](https://docs.edg.io/guides/v7/performance/observability/core_web_vitals)

## Getting Started

### Clone This Repo

Use `git clone https://github.com/edgio-docs/edgio-v7-full-featured-performance-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
npm install
```

### Run the app locally on Edgio

Run the Next.js app with the command:

```bash
npm run edgio:dev
```

Load the site: http://127.0.0.1:3000

### Testing production build locally with Edgio

You can do a production build of your app and test it locally using:

```bash
npm run edgio:build && npm run edgio:production
```

Setting --production runs your app exactly as it will be uploaded to the Edgio cloud using serverless-offline.

## Deploying to Edgio

Deploying requires an account on Edgio. [Sign up here for free](https://edgio.app/signup). Once you have an account, you can deploy to Edgio by running the following in the root folder of your project:

```bash
npm run edgio:deploy
```

See [deploying](https://docs.edg.io/guides/deploying) for more information.

## Demo

https://edgio-community-examples-v7-full-featured-performance-live.edgio.link/
