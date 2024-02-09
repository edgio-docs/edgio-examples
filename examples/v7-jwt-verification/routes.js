// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  .use(edgioRoutes)
  .get('/', ({ serveStatic }) => {
    serveStatic('static/validate.html');
  })
  .post('/jwt', {
    edge_function: './edge-functions/validate.js',
  });
