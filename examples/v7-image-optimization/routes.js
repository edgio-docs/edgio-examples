import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  .use(edgioRoutes)

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

  .match(/\/img-optimize\/(.*)/, {
    origin: {
      set_origin: 'wikiupload',
    },
    url: {
      url_rewrite: [
        {
          source: '/img-optimize/(.*)',
          syntax: 'regexp',
          destination: '/$1',
        },
      ],
    },
    response: {
      optimize_images: true,
    },
  });
