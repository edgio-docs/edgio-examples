# Deploy Ember.js example to Edgio

A demo deployment of Ember.js app to Edgio.

## Demo

https://layer0-docs-layer0-emberjs-example-default.layer0-limelight.link

## Try It Now

[![Deploy with Edgio](https://docs.layer0.co/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/layer0-docs/layer0-emberjs-example)

## Getting Started

### Clone This Repo

Use `git clone https://github.com/layer0-docs/layer0-emberjs-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
npm install
```

### Run the Ember.js app locally on Edgio

Run the Ember.js app with the command:

```bash
npm run start
```

Load the site: http://127.0.0.1:3000

### Testing production build locally with Edgio

You can do a production build of your app and test it locally using:

```bash
npm run build && edgio build && edgio run --production
```

Setting --production runs your app exactly as it will be uploaded to the Edgio cloud using serverless-offline.

## Deploying to Edgio

Deploying requires an account on Edgio. [Sign up here for free](https://app.layer0.co/signup). Once you have an account, you can deploy to Edgio by running the following in the root folder of your project:

```bash
edgio deploy
```

See [deploying](https://docs.edg.io/guides/deploying) for more information.
