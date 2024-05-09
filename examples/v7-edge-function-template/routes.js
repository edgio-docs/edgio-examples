// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core'

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

  // Here is an example of how to specify an edge function to run for a particular path
  // .get('/', {
  //   edge_function: './edge-functions/main.js',
  //   caching: {
  //     max_age: '1d', // optionally cache the output of the edge function for 1 day
  //   }
  // })

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)
