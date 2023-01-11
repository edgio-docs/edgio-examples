# Deploy VitePress example to Edgio

A demo deployment of VitePress app to Edgio.

## Demo

https://layer0-docs-layer0-vitepress-example-default.layer0-limelight.link

## Try It Now

[![Deploy with Edgio](https://docs.layer0.co/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/layer0-docs/layer0-vitepress-example)

## Getting Started

### Clone This Repo

Use `git clone https://github.com/layer0-docs/layer0-vitepress-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
yarn install
```

### Run the Vuepress app locally on Edgio

Run the Vuepress app with the command:

```bash
yarn docs:dev
```

Load the site: http://127.0.0.1:3000

### Testing production build locally with Edgio

You can do a production build of your app and test it locally using:

```bash
yarn docs:build # Production build of your app locally
layer0 build && layer0 run --production # Production build of your app on Edgio locally
```

Setting --production runs your app exactly as it will be uploaded to the Edgio cloud using serverless-offline.

## Deploying to Edgio

Deploying requires an account on Edgio. [Sign up here for free](https://app.layer0.co/signup). Once you have an account, you can deploy to Edgio by running the following in the root folder of your project:

```bash
layer0 deploy
```

See [deploying](https://docs.layer0.co/guides/deploying) for more information.
