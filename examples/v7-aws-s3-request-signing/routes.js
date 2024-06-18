// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  // Built-in Edgio routes
  .use(edgioRoutes)

  // Specifies the edge function for /s3/* paths
  .get('/s3/:anything*', {
    edge_function: './edge-functions/main.js',
  })

  // Serves the main.html file for the root path
  .get('/', ({ serveStatic }) => serveStatic('public/main.html'));
