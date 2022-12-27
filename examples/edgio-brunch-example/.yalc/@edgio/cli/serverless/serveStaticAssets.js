"use strict";

const fs = require('fs');

const {
  join,
  basename
} = require('path');

const mime = require('mime-types');

const decodeUriComponent = require('decode-uri-component');

const {
  createServer
} = require('http');
/**
 * Serves assets in local development.
 * @param dir The .edgio/s3 directory
 */


module.exports = function serveStaticAssets(oneOrManyDirectories, port) {
  return new Promise((resolve, reject) => {
    try {
      const server = createServer((req, res) => {
        try {
          const path = req.url.split(/\?/)[0].slice(1);
          const directories = Array.isArray(oneOrManyDirectories) ? oneOrManyDirectories : [oneOrManyDirectories];
          let file = directories.map(dir => join(dir, decodeUriComponent(path))).find(f => fs.existsSync(f) && !fs.statSync(f).isDirectory()); // If we did not find the file, we look to directory index

          if (!file) {
            file = directories.map(dir => join(dir, decodeUriComponent(path), 'index.html')).find(f => fs.existsSync(f));
          }

          if (file) {
            res.setHeader('Content-Type', mime.lookup(basename(file)));
            res.setHeader('Content-Length', fs.statSync(file).size);
            fs.createReadStream(file).pipe(res);
          } else {
            // We are emulating the behavior of S3 which returns 403 on an actual 404.
            res.writeHead(403);
            res.end();
          }
        } catch (e) {
          // We are emulating the behavior of edge which would return 503 if S3 couldn't be reached/etc.
          res.writeHead(503);
          res.end();
        }
      });
      server.listen(port, resolve);
    } catch (e) {
      reject(e);
    }
  });
};