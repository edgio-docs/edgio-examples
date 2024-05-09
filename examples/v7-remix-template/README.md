# Edgio v7 Remix Template

This template is a basic Remix + Express app powered by Edgio. You may create a new property using this template from the [Edgio Console](https://app.edg.io).

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

Check out the [Edgio + Remix Documentation](https://docs.edg.io/guides/v7/sites_frameworks/getting_started/remix) for more details.

---

# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
