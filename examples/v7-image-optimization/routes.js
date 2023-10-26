import { Router, edgioRoutes } from '@edgio/core';
import homeHandler from './edgio/homeHandler';

export default new Router()
  .use(edgioRoutes)

  // example page for image optimization
  .match('/', ({ compute }) => {
    compute(homeHandler);
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
