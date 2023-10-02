// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)
  .static('public')

  // ================== IMPORTANT ==================
  // ========== Edge Functions Activation ==========
  //
  // Before deploying, Edge Functions must be enabled on your account. Failing to do so will result in deployment failures.
  // For local testing, you may run the examples without activation. Refer to the README for more guidance on local testing.
  //
  // For information on how to activate this feature, please visit:
  // https://docs.edg.io/guides/v7/edge-functions
  //
  // ===============================================

  .match('/', {
    edge_function: './functions/general/sample-html-page.js',
  })
  .match('/example/hello-world', {
    edge_function: './functions/edge-function.js',
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
  .match('/example/redirects(.*)', {
    edge_function: './functions/general/redirect.js',
  })
  .match('/example/planetscale-database', {
    edge_function: './functions/database/planetscale/index.js',
  })
  .match('/example/upstash-database', {
    edge_function: './functions/database/upstash/index.js',
  });
