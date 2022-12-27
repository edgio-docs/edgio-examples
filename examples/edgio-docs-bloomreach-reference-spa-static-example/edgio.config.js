// This file was automatically added by edgio deploy.
// You should commit this file to source control.
module.exports = {
  backends: {
    origin: {
      // The domain name or IP address of the origin server
      domainOrIp: process.env.BRXM_ENDPOINT || "trial-tnk8sgqr.bloomreach.io",

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      hostHeader: process.env.BRXM_ENDPOINT || "trial-tnk8sgqr.bloomreach.io",

      // Uncomment the following line if TLS is not set up properly on the origin domain and you want to ignore TLS errors
      // disableCheckCert: true,

      // Overrides the default ports (80 for http and 443 for https) and instead use a specific port
      // when connecting to the origin
      // port: 1337,
    },
    graphql: {
      // The domain name or IP address of the origin server
      domainOrIp:
        process.env.GRAPHQL_SERVICE_URL ||
        "graphql.trial-tnk8sgqr.bloomreach.io",

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      hostHeader:
        process.env.GRAPHQL_SERVICE_URL ||
        "graphql.trial-tnk8sgqr.bloomreach.io",

      // Uncomment the following line if TLS is not set up properly on the origin domain and you want to ignore TLS errors
      // disableCheckCert: true,

      // Overrides the default ports (80 for http and 443 for https) and instead use a specific port
      // when connecting to the origin
      // port: 1337,
    },
  },

  // The name of the site in Edgio to which which this app should be deployed.
  name: "@bloomreach/edgio-example-saas",

  // The name of the team in Edgio to which which this app should be deployed.
  // team: 'my-team-name',

  // Overrides the default path to the routes file. The path should be relative to the root of your app.
  // routes: 'routes.js',

  // The maximum number of URLs that will be concurrently prendered during deployment when static prerendering is enabled.
  // Defaults to 200, which is the maximum allowed value.
  // prerenderConcurrency: 200,

  // A list of glob patterns identifying which source files should be uploaded when running edgio deploy --includeSources. This option
  // is primarily used to share source code with Edgio support personnel for the purpose of debugging. If omitted,
  // edgio deploy --includeSources will result in all files which are not gitignored being uploaded to Edgio.
  //
  sources: [
    // '**/*', // include all files
    // '!(**/secrets/**/*)', // except everything in the secrets directory
    // ".env",
  ],

  // Set to true to include all packages listed in the dependencies property of package.json when deploying to Edgio.
  // This option generally isn't needed as Edgio automatically includes all modules imported by your code in the bundle that
  // is uploaded during deployment
  //
  // includeNodeModules: true,
};
