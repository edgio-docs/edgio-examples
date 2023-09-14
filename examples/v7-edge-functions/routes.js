// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)
  .static('public')

  // Edgio Functions
  .match('/', {
    edge_function: './functions/general/sample-html-page.js',
  })
  .match('/example/generate.json', {
    edge_function: './functions/general/generate-json.js',
  })
  .match('/example/change-headers.json', {
    edge_function: './functions/general/change-headers.js',
  })
  .match('/example/manifest-manipulation', {
    edge_function: './functions/general/manifest-manipulation.js',
  })
  .match('/example/content-stitching', {
    edge_function: './functions/general/content-stitching.js',
  })
  .match('/example/planetscale-database', {
    edge_function: './functions/database/planetscale/index.js',
  })
  .match('/example/upstash-database', {
    edge_function: './functions/database/upstash/index.js',
  });
