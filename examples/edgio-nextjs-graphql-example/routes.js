// This file was automatically added by edgio deploy.
// You should commit this file to source control.
const { Router, deriveSurrogateKeysFromJson } = require('@edgio/core/router')
const { nextRoutes } = require('@edgio/next')

const apiPath = '/api/graphql'
const cacheConfig = {
  edge: {
    maxAgeSeconds: 60 * 60, // 1 hour
    staleWhileRevalidateSeconds: 60 * 60 * 24, // 1 day
  },
}

module.exports = new Router()
  .graphqlOperation(
    {
      path: apiPath,
      name: 'GetCategories',
    },
    ({ cache }) => cache(cacheConfig)
  )
  .graphqlOperation(
    {
      path: apiPath,
      name: 'GetProductsOfCategory',
    },
    ({ cache }) => cache(cacheConfig)
  )
  .graphqlOperation(
    {
      path: apiPath,
      name: 'GetProduct',
    },
    ({ cache, renderWithApp }) => {
      cache(cacheConfig)
      renderWithApp({
        transformResponse: deriveSurrogateKeysFromJson((json) => [
          `product.${json.data.product.id}`,
        ]),
      })
    }
  )
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
  })
  .use(nextRoutes) // automatically adds routes for all files under /pages
