# Deploying Sanity Studio with Edgio

## By [Rishi Raj Jain](https://rishi.app)

Sanity Studio is a single page app (SPA) written in React, where you can configure the document types and input fields, with simple JavaScript objects. This guide will walk you through how to deploy Sanity Studio with Edgio in four simple steps.

![Deploying Sanity Studio with Edgio](https://cdn.sanity.io/images/81pocpw8/production/a430c6c7d8de38357ddb99a38876ca955a16c9ee-1200x630.png?w=800&h=420&fit=clip&auto=format)

## Step 1: Setting Up your Sanity Studio Project

**NOTE:** You can skip this step if you already have a project set up.

First, install the [Sanity CLI](https://www.npmjs.com/package/@sanity/cli):

```bash
npm i -g @sanity/cli
```

To initiate a new project and download the Studio code to your computer, run the following in the command line:

```bash
sanity init
```

The Sanity CLI will walk you through the necessary steps to set up a project, letting you choose a schema template. When you're done with these steps, the CLI will download the source code and configuration to get you started. To start a local development server, `cd` into the project folder and run the following command:

```bash
sanity start
```

## Step 2: Preparing for Deployment

First, install the [Edgio CLI](https://www.npmjs.com/package/@edgio/cli):

```bash
npm i -g @edgio/cli
```

To add Edgio to an existing app, run the following:

```bash
edgio init --edgioVersion=5.0.4-next-1666555416-d7dfbab.0 --connector=@edgio/sanity-studio
```

The above command creates routes.ts and edgio.config.js.

## Step 3: Preview Production Locally With Edgio

To preview production app locally run:

```bash
edgio build && edgio run --production
```

## Step 4: Deploy With Edgio

To deploy run:

```bash
edgio deploy
```

Once Sanity Studio is deployed, you will need to add it's URL to Sanity’s [CORS origins](https://www.sanity.io/docs/front-ends/cors) settings. You can do this from the command line:

`sanity cors add https://your-url.layer0-limelight.link --credentials`

Alternatively, you can navigate to [manage.sanity.io](https://manage.sanity.io/), find your project and under Settings > API, add the Studio URL to the CORS origins list. You should allow credentials as the Studio requires authentication for added security.
