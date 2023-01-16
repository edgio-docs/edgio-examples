// This file was automatically added by edgio deploy.
// You should commit this file to source control.
module.exports = {
  connector: '@edgio/express',
  express: {
    // The main entry point(s) for your app, which exports an instance of express app.
    // This file and its dependencies will be bundled into a single file for serverless deployment.
    //
    // If omitted, Edgio will try to find an entrypoint in one of the following files:
    // - ./src/server.ts
    // - ./src/server.js
    // - ./src/app.ts
    // - ./src/app.js
    // - ./src/index.ts
    // - ./src/index.js
    // - ./app.js
    // - ./index.js
    //
    // Uncomment the line below to specify the path to the entry point(s):
    // entryPoints: ['./src/app.js']
  },
}
