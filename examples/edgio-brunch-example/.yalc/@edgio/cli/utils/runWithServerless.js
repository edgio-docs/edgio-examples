"use strict";

var _fs = require("fs");

const {
  join
} = require('path');

const serveFunction = require('../serverless/serveFunction');

const slash = require('slash');

const chalk = require('chalk');

const serveStaticAssets = require('../serverless/serveStaticAssets');

const serveImageOptimizer = require('../serverless/serveImageOptimizer');
/**
 * Runs the bundled app, simulating the serverless environment
 * @param dir The .edgio directory
 */


module.exports = async function runWithServerless(dir) {
  const jsDir = join(dir, 'lambda');
  const assetsDir = join(dir, 's3');
  const permanentAssetsDir = join(dir, 's3-permanent');
  const jsPort = parseInt(process.env.PORT || 3000);
  const staticPort = jsPort + 2;
  const imageOptimizerPort = jsPort + 3;
  process.chdir(jsDir); // needed for environment.isCloud() to return true

  process.env.EDGIO_DEPLOYMENT_TYPE = 'AWS';
  process.env.NODE_ENV = 'production';
  process.env.EDGIO_CACHE = 'true';
  process.env.EDGIO_LOCAL = 'true'; // this turns off the wrapping of stdout, stderr

  process.env.EDGIO_IMAGE_OPTIMIZER_HOST = '127.0.0.1';
  process.env.EDGIO_IMAGE_OPTIMIZER_PORT = imageOptimizerPort; // used only when we run image-optimizer locally
  // needed for ResponseWriter.serveStatic to know how to contact the static asset server

  process.env.EDGIO_CONFIG = JSON.stringify({
    backends: {
      __static__: {
        domainOrIp: `127.0.0.1`,
        port: staticPort
      },
      __permanent_static__: {
        domainOrIp: `127.0.0.1`,
        port: staticPort
      },
      __image_optimizer__: {
        domainOrIp: `127.0.0.1`,
        port: imageOptimizerPort
      }
    }
  }); // lambda server

  const handlerPath = [slash(jsDir) + '/handler.ts', slash(jsDir) + '/handler.cjs'].find(_fs.existsSync) || slash(jsDir) + '/handler.js';

  const handler = require(handlerPath).handler;

  serveFunction(handler, jsPort);
  serveStaticAssets([assetsDir, permanentAssetsDir], staticPort);
  serveImageOptimizer(imageOptimizerPort);
  console.log(chalk.green(`> Application ready on http://localhost:${jsPort}`));
};