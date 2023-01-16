# Deploying MkDocs with Edgio

A demo deployment of MkDocs app to Edgio.

## Demo

https://layer0-docs-layer0-mkdocs-example-default.layer0-limelight.link

## Try It Now

[![Deploy with Edgio](https://docs.edg.io/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/edgio-docs/edgio-mkdocs-example)

## Getting Started

### Step 1: Setting Up your MkDocs Project

**NOTE:** You can skip this step if you already have a project set up.

First, install the [MkDocs CLI](https://www.mkdocs.org/getting-started/#installation):

```bash
pip3 install mkdocs
mkdocs new my-mkdocs-project
```

### Step 2: Preparing for Deployment

First, install the [Edgio CLI](https://www.npmjs.com/package/@edgio/cli):

```bash
npm i -g @edgio/cli
```

To add Edgio to an existing app, run the following:

```bash
edgio init --edgioVersion=5.0.4-next-1666625296-59d2155.0 --connector=@edgio/mkdocs
```

### Step 3: Preview Production Locally With Edgio

To preview production app locally run:

```bash
edgio build && edgio run --production
```

### Step 4: Deploy With Edgio

To deploy run:

```bash
edgio deploy
```
