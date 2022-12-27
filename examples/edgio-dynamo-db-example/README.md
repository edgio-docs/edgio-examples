# Deploy DynamoDB example to Layer0

An example that shows you how to connect to DynamoDB from within a Layer0 serverless compute.

## Demo

https://layer0-docs-layer0-dynamo-db-example-default.layer0-limelight.link

## Try It Now

[![Deploy with Layer0](https://docs.layer0.co/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/layer0-docs/layer0-dynamo-db-example)

## Getting Started

### Clone This Repo

Use `git clone https://github.com/layer0-docs/layer0-dynamo-db-example.git` to get the files within this repository onto your local machine.

### Install dependencies

On the command line, in the project root directory, run the following command:

```bash
npm install
```

### Run the DynamoDB app locally on Layer0

Run the Docusaurus app with the command:

```bash
npm run layer0:dev
```

- Copy .env.example to .env and fill in your AWS access key and AWS secret key.
- Create a DynamoDB table named `layer0-poc-users` and add some records to it.
- Go to https://localhost:3000
- You should see the contents of your `layer0-poc-users` table returned as JSON

### Testing production build locally with Layer0

You can do a production build of your app and test it locally using:

```bash
npm run layer0:build && npm run layer0:production
```

## Deploying to Layer0

- Open you site in Layer0 Developer Console, navigate to the default environment, and follow the [secrets guide](https://docs.layer0.co/guides/security#section_secrets) to add your `ACCESS_KEY` and `SECRET_KEY`.
- Activate the updated environment config. Once the site finishes redeploying, the root URL will return the same JSON data that you see locally.
- Deploying requires an account on Layer0. [Sign up here for free](https://app.layer0.co/signup). Once you have an account, you can deploy to Layer0 by running the following in the root folder of your project:

```bash
npm run layer0:deploy
```

See [deploying](https://docs.layer0.co/guides/deploying) for more information.
