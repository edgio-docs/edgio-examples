# An Edgio Application Performance Example
## Demo

https://edgio-community-examples-full-featured-performance-live.layer0-limelight.link/

## Implemented Features

* [Multiple origins proxying](https://docs.edg.io/guides/performance/cdn_as_code/common_routing_patterns#proxying-an-origin)
* [StaleWhileRevalidate](https://docs.edg.io/guides/performance/caching#achieving-100-cache-hit-rates) additional cache buffer
* [Prefetching](https://docs.edg.io/guides/performance/prefetching)
* [Deepfetching](https://docs.edg.io/guides/performance/prefetching#deep-fetching)
* [Image Optimization](https://docs.edg.io/guides/performance/image_optimization)
* [Response Transformation with Serverless](https://docs.edg.io/guides/performance/serverless_compute)
* [Header Manipulation](https://docs.edg.io/guides/performance/cdn_as_code#alter-requests-and-responses)
* [Cache Key Normalization](https://docs.edg.io/guides/performance/caching#customizing-the-cache-key)
* [DevTools](https://docs.edg.io/guides/performance/observability/devtools)
* [RUM script injection](https://docs.edg.io/guides/performance/observability/core_web_vitals)

## Getting Started

### Clone This Repo

Use `git clone https://github.com/edgio-docs/edgio-v7-full-featured-performance-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
npm install
```

### Run the Next.js app locally on Edgio

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
