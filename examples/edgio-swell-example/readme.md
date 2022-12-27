# Deploy Swell Origin Theme to Layer0

A demo of Swell integration with Nuxt.js and Layer0.

## Getting Started

### Clone This Repo

Use `git clone https://github.com/layer0-docs/layer0-swell-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
yarn install
```

### Run the Swell app locally on Layer0

Run the Swell app with the command:

```bash
yarn layer0:dev
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
layer0 deploy
```

See [deploying](https://docs.layer0.co/guides/deploying) for more information.
