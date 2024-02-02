import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  .use(edgioRoutes)
  .always({
    caching: {
      max_age: '1d',
    },
  })
  // example page for image optimization
  .match('/', {
    edge_function: 'edge-functions/main.js',
  })

  // serve static images and apply optimizations
  .match(/\/images\/(.*)/, ({ addFeatures, serveStatic }) => {
    serveStatic('public/images/$1', {});
    addFeatures({
      response: {
        optimize_images: true,
      },
    });
  })

  .match('/:path*', {
    origin: {
      set_origin: 'wikiupload',
    },
    response: {
      optimize_images: true,
    },
  });
