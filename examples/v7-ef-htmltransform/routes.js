// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  .get('/basic_example', {
    edge_function: './edge-functions/basic_example.js',
    caching: {
      max_age: '1h',
    },
  })
  .get('/esi_example', {
    edge_function: './edge-functions/esi_example.js',
    caching: {
      max_age: '1h',
    },
  })
  .get('/esi_response_stream_example', {
    edge_function: './edge-functions/esi_response_stream_example.js',
    caching: {
      max_age: '1h',
    },
  })
  .get('/', ({ serveStatic }) => {
    serveStatic('./public/main.html');
  })

  // serve static files from the /public directory
  .static('./public')

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes);
