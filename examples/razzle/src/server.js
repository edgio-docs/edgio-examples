import App from './App'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import { renderToString } from 'react-dom/server'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js.map((asset) => `<script src="${asset}"${extra}></script>`).join('')
      : ''
    : ''
}

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {}
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    )

    if (context.url) {
      res.redirect(context.url)
    } else {
      res.status(200).send(
        `<!doctype html>
          <html lang="">
            <head>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link
              as="style"
              rel="preload"
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
            />
            <noscript>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
              />
            </noscript>
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="robots"
              content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
            />
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="theme-color" content="#000000" />
            <link rel="stylesheet" href="/index.css" />
            </head>
            <body>
                <div id="root">${markup}</div>
                ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
                <script defer src="/__edgio__/devtools/install.js"></script>
            </body>
        </html>`
      )
    }
  })

export default server
