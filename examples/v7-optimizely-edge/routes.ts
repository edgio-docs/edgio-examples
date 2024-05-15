// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core/router';
import { nextRoutes } from '@edgio/next';

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)

  // Add a custom route for the Optimizely Edge Function
  .match('/optimizely', {
    edge_function: './edge-functions/main.js',
  });
