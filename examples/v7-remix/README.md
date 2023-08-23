# Edgio v7 Remix Template

This example is a basic Remix template powered by Edgio.

**Preview**: https://edgio-community-examples-v7-remix-live.edgio.link/

To get started with local development, run the following to install the Edgio CLI and start the development server:

```bash
# Install the latest version of the Edgio CLI
npm i -g @edgio/cli@latest

npm install
npm run edgio:dev
```

To test the production build locally, run the following commands:

```bash
npm run edgio:build

edgio run -p
```

When you're ready to deploy, run the following commands:

```bash
npm run edgio:deploy
```

---

## Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

### Development

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

### Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

#### DIY

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

#### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over relevant code/assets from your current app to the new project that's pre-configured for your target server.

Most importantly, this means everything in the `app/` directory, but if you've further customized your current application outside of there it may also include:

- Any assets you've added/updated in `public/`
- Any updated versions of root files such as `.eslintrc.js`, etc.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
