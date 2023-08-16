// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  // Here is an example where we cache api/* at the edge but prevent caching in the browser
  // .match('/api/:path*', {
  //   caching: {
  //     max_age: '1d',
  //     stale_while_revalidate: '1h',
  //     bypass_client_cache: true,
  //     service_worker_max_age: '1d',
  //   },
  // })

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)

  .static('public')

  // Edgio Functions
  .match('/', {
    edge_function: './functions/sample-html-page.js',
  })
  .match('/example/generate.json', {
    edge_function: './functions/generate-json.js',
  })
  .match('/example/change-headers.json', {
    edge_function: './functions/change-headers.js',
  })
  .match('/example/manifest-manipulation', {
    edge_function: './functions/manifest-manipulation.js',
  })
  .match('/example/planetscale-database.json', {
    edge_function: './functions/planetscale-database.js',
  });
