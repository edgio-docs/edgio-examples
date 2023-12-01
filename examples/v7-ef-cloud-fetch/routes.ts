// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core/router';
import { nextRoutes } from '@edgio/next';

export default new Router()
  // NextRoutes automatically adds routes for all Next.js pages and their assets
  .use(nextRoutes)

  // To show the difference between the cloud function and edge function responses,
  // we'll add a query parameter that must be present for the edge function to process
  // the request.
  //
  // For example, a request to /example will be handled only by Next.js as the cloud function.
  // A request to /example?edge=1 will be handled by the edge function which forwards the request
  // to the cloud function.
  .match(
    {
      path: '/example',
      query: {
        edge: /1/,
      },
    },
    {
      edge_function: './edge-functions/index.js',
    }
  );
