// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core/router';
import { nextRoutes } from '@edgio/next';
import cohereHandler from './edgio/cohere';

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)
  .post('/summarize', cohereHandler);
