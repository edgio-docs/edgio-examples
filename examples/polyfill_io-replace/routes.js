// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core';

export default new Router()
  // Edge function to replace the polyfill.io script tag(s) with the Cloudflare CDN URL
  .match('/', {
    edge_function: './edge-functions/main.js',
  })

  // Serve a static HTML file that includes the polyfill.io script tags
  .match('/polyfill.io-example', ({ serveStatic }) => {
    serveStatic('public/polyfill.io.html');
  })

  .static('public')

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes);
