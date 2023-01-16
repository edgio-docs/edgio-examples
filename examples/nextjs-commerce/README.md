# Deploy Next.js Commerce leveraging BigCommerce example to Layer0

A demo deployment of Next.js Commerce leveraging BigCommerce to power the storefront backend to Layer0.

The all-in-one starter kit for high-performance e-commerce sites. With a few clicks, Next.js developers can clone, deploy and fully customize their own store.

## Demo

https://layer0-docs-layer0-nextjs-commerce-default.layer0-limelight.link

## Detailed Guides

- [Next.js Commerce](https://docs.edg.io/guides/next_commerce)
- [BigCommerce](https://docs.edg.io/guides/next_commerce) - includes details on setting up your BigCommerce store.

## Try It Now

[![Deploy with Layer0](https://docs.edg.io/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/layer0-docs/layer0-nextjs-commerce-example)

## Getting Started

### Clone This Repo

Use `git clone https://github.com/layer0-docs/layer0-nextjs-commerce-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
yarn install
```

### Run the Next.js app locally

Run the Next.js app with the command:

```bash
yarn run dev
```

### Run the Next.js app locally with Layer0

```bash
cd site
npm run layer0:dev
```

Load the site: http://127.0.0.1:3000

### Testing production build locally with Layer0

You can do a production build of your app and test it locally using:

```bash
layer0 build && layer0 run --production
```

Setting --production runs your app exactly as it will be uploaded to the Layer0 cloud using serverless-offline.

## Deploying to Layer0

Deploying requires an account on Layer0. [Sign up here for free](https://app.layer0.co/signup). Once you have an account, you can deploy to Layer0 by running the following in the root folder of your project:

```bash
npm run layer0:deploy
```

See [deploying](https://docs.edg.io/guides/deploying) for more information.

## Features

- Performant by default
- SEO Ready
- Internationalization
- Responsive
- UI Components
- Theming
- Standardized Data Hooks
- Integrations - Integrate seamlessly with the most common ecommerce platforms.
- Dark Mode Support

## Integrations

Next.js Commerce integrates out-of-the-box with BigCommerce, Shopify, Swell, Saleor, Vendure, Spree and Commerce.js. We plan to support all major ecommerce backends.

## Considerations

- `packages/commerce` contains all types, helpers and functions to be used as base to build a new **provider**.
- **Providers** live under `packages`'s root folder and they will extend Next.js Commerce types and functionality (`packages/commerce`).
- We have a **Features API** to ensure feature parity between the UI and the Provider. The UI should update accordingly and no extra code should be bundled. All extra configuration for features will live under `features` in `commerce.config.json` and if needed it can also be accessed programatically.
- Each **provider** should add its corresponding `next.config.js` and `commerce.config.json` adding specific data related to the provider. For example in case of BigCommerce, the images CDN and additional API routes.

## Configuration

### How to change providers

Open `site/.env.local` and change the value of `COMMERCE_PROVIDER` to the provider you would like to use, then set the environment variables for that provider (use `site/.env.template` as the base).

The setup for Shopify would look like this for example:

```
COMMERCE_PROVIDER=@vercel/commerce-shopify
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=xxxxxxx.myshopify.com
```

### Features

Every provider defines the features that it supports under `packages/{provider}/src/commerce.config.json`

#### Features Available

The following features can be enabled or disabled. This means that the UI will remove all code related to the feature.
For example: Turning `cart` off will disable Cart capabilities.

- cart
- search
- wishlist
- customerAuth
- customCheckout

#### How to turn Features on and off

> NOTE: The selected provider should support the feature that you are toggling. (This means that you can't turn wishlist on if the provider doesn't support this functionality out the box)

- Open `site/commerce.config.json`
- You'll see a config file like this:
  ```json
  {
    "features": {
      "wishlist": false,
      "customCheckout": true
    }
  }
  ```
- Turn `wishlist` on by setting `wishlist` to `true`.
- Run the app and the wishlist functionality should be back on.

### How to create a new provider

Follow our docs for [Adding a new Commerce Provider](packages/commerce/new-provider.md).

If you succeeded building a provider, submit a PR with a valid demo and we'll review it asap.

## Work in progress

We're using Github Projects to keep track of issues in progress and todo's. Here is our [Board](https://github.com/vercel/commerce/projects/1)

People actively working on this project: @okbel, @lfades, @dominiksipowicz, @gbibeaul.

## Troubleshoot

<details>
<summary>I already own a BigCommerce store. What should I do?</summary>
<br>
First thing you do is: <b>set your environment variables</b>
<br>
<br>
.env.local

```sh
BIGCOMMERCE_STOREFRONT_API_URL=<>
BIGCOMMERCE_STOREFRONT_API_TOKEN=<>
BIGCOMMERCE_STORE_API_URL=<>
BIGCOMMERCE_STORE_API_TOKEN=<>
BIGCOMMERCE_STORE_API_CLIENT_ID=<>
BIGCOMMERCE_CHANNEL_ID=<>
```

If your project was started with a "Deploy with Vercel" button, you can use Vercel's CLI to retrieve these credentials.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and Github accounts (creates .vercel file): `vercel link`
3. Download your environment variables: `vercel env pull .env.local`

Next, you're free to customize the starter. More updates coming soon. Stay tuned..

</details>

<details>
<summary>BigCommerce shows a Coming Soon page and requests a Preview Code</summary>
<br>
After Email confirmation, Checkout should be manually enabled through BigCommerce platform. Look for "Review & test your store" section through BigCommerce's dashboard.
<br>
<br>
BigCommerce team has been notified and they plan to add more details about this subject.
</details>

<details>
<summary>When run locally I get `Error: Cannot find module '...@vercel/commerce/dist/config'`</summary>

```bash
commerce/site
❯ yarn dev
yarn run v1.22.17
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /commerce/site/.env.local
error - Failed to load next.config.js, see more info here https://nextjs.org/docs/messages/next-config-error
Error: Cannot find module '/Users/dom/work/vercel/commerce/node_modules/@vercel/commerce/dist/config.cjs'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:960:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:953:15)
    at resolveExports (node:internal/modules/cjs/loader:482:14)
    at Function.Module._findPath (node:internal/modules/cjs/loader:522:31)
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:919:27)
    at Function.mod._resolveFilename (/Users/dom/work/vercel/commerce/node_modules/next/dist/build/webpack/require-hook.js:179:28)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/Users/dom/work/vercel/commerce/site/commerce-config.js:9:14) {
  code: 'MODULE_NOT_FOUND',
  path: '/Users/dom/work/vercel/commerce/node_modules/@vercel/commerce/package.json'
}
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

The error usually occurs when running yarn dev inside of the `/site/` folder after installing a fresh repository.

In order to fix this, run `yarn dev` in the monorepo root folder first.

> Using `yarn dev` from the root is recommended for developing, which will run watch mode on all packages.

</details>
