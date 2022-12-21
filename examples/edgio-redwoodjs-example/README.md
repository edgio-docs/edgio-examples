# Deploy Redwood on Layer0 with Limelight

Layer0 by Limelight is an Edge Compute Platform with over 130 global points of presence. Limelight operates its own private network with more than 70+ terabits per second of global egress capacity. Data is prefetched and streamed into the browser at a 95% cache hit rate by Layer0 before the user requests it.

![Cache hit rate comparison graphic](https://assets-global.website-files.com/5ec129d839c03647b43dbd41/619459e884ec7ae74d923da8_I6iG8tVXinoz29x52oRnHeDYe8WmpuND7AdmwC9-c64qzxJVkN8fpn5Vlogr7W67K-peNtFsLvmBWDWuzlNJ1VnEXM3Iso4ijaf8tXlxd0Mmmk3LrBTLKXUCj_GJASq3WsIbksyJ.jpeg)

In addition to hosting your static assets, Layer0 also includes edge functions with [EdgeJS](https://www.layer0.co/edgejs), a framework agnostic, performant, and declarative JavaScript-based edge configuration language.

## Demo

https://layer0-docs-layer0-redwoodjs-example-default.layer0-limelight.link

## Try It Now

[![Deploy with Layer0](https://docs.layer0.co/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/layer0-docs/layer0-redwoodjs-example)

## Layer0 Configuration

This project is configured to use a Layer0 [connector](https://docs.layer0.co/guides/connectors) for RedwoodJS.

### `layer0.config.js`

The `layer0.config.js` configuration file specifies the configuration of the project such as defining the connector. In this case, it is using the connector `@layer0/redwood`.

```js
// layer0.config.js

module.exports = {
  connector: '@layer0/redwood',
}
```

### `routes.js`

```js
// routes.js

import { Router } from '@layer0/core'
import { redwoodRoutes } from '@layer0/redwood'

export default new Router().use(redwoodRoutes)
```

### `HomePage.js`

```js
// web/src/pages/HomePage/HomePage.js

import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags
        title="Home"
        description="An example Redwood application deployed on Layer0"
      />

      <h1>Redwood+Layer0 🚀</h1>
      <p>Woot!</p>
    </>
  )
}

export default HomePage
```

### Start development server with Layer0

`0 dev` starts the Layer0 dev server and the Redwood development server. Layer0 is on port 3000 and Redwood is started on 3001 by forwarding the port.

```terminal
yarn 0 dev
```

Open automatically to `http://localhost:8910` to see the web app.

![home-page-localhost-8910](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ijenahgpkabvms5qfbpo.png)

## Deploy

`0 build` does a Redwood build of both the `web` and `api` sides as well as a Layer0 build for copying the necessary build assets.

```bash
yarn 0 build
```

`0 run -p` runs the build simulating production mode.

```bash
yarn 0 run -p
```

This starts Redwood's `apiServerHandler` on Layer0's production port and sets the `apiRootPath` to whatever is defined in `redwood.toml`. This means any API request that comes in starts up that server to handle the request.

### Deploy to Layer0

`0 deploy`

```bash
yarn 0 deploy
```

```
***** Deployment Complete ***********************************************************
*                                                                                   *
*  🖥  Layer0 Developer Console:                                                     *
*  https://app.layer0.co/layer0-docs/layer0-redwoodjs-example/env/default/builds/2  *
*                                                                                   *
*  🌎 Website:                                                                      *
*  https://layer0-docs-layer0-redwoodjs-example-default.layer0-limelight.link       *
*                                                                                   *
*************************************************************************************
```

### Test endpoint

```bash
curl \
  --request POST \
  --header 'content-type: application/json' \
  --url 'https://layer0-docs-layer0-redwoodjs-example-default.layer0-limelight.link/api/graphql' \
  --data '{"query":"{ redwood { version } }"}'
```

```json
{
  "data":{
    "redwood":{
      "version":"1.0.0"
    }
  }
}
```
