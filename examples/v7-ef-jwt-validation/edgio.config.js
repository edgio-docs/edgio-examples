// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: '@edgio/express',
  
  // The name of the site in Edgio to which this app should be deployed.
  name: "edgio-v7-ef-jwt-validation-example",

  // The name of the organization in Edgio to which this app should be deployed.
  // organization: 'my-organization-name',

  // Overrides the default path to the routes file. The path should be relative to the root of your app.
  // routes: 'routes.js',

  // When set to true, Edgio includes the deployment number in the cache key,
  // effectively purging the cache each time you deploy.
  purgeCacheOnDeploy: true,
  // If omitted this will default to the "Automatic Purging" configuration on the environment's Caching tab.
  // purgeCacheOnDeploy: false,

  // Uncomment the following to specify environment specific configs
  // environments: {
  //   production: {
  //     hostnames: [{ hostname: 'www.mysite.com' }],
  //   },
  //   staging: {
  //     hostnames: [{ hostname: 'staging.mysite.com' }],
  //     origins: [
  //       {
  //         name: 'origin',
  //         hosts: [{ location: 'staging-origin.mysite.com' }],
  //         override_host_header: 'staging-origin.mysite.com',
  //         tls_verify: {
  //           use_sni: true,
  //           sni_hint_and_strict_san_check: 'staging-origin.mysite.com',
  //         },
  //         shields: { us_east: 'DCD' },
  //       },
  //     ],
  //   },
  // },

  // Options for hosting serverless functions on Edgio
  serverless: {
    // // Set to true to include all packages listed in the dependencies property of package.json when deploying to Edgio.
    // // This option generally isn't needed as Edgio automatically includes all modules imported by your code in the bundle that
    // // is uploaded during deployment
    // includeNodeModules: true,
  
    // Include additional paths that are dynamically loaded by your app at runtime here when building the serverless bundle.
    include: ['static'],
  },

  // The maximum number of URLs that will be concurrently prerendered during deployment when static prerendering is enabled.
  // Defaults to 200, which is the maximum allowed value.
  // prerenderConcurrency: 200,

  // A list of glob patterns identifying which source files should be uploaded when running edgio deploy --includeSources.
  // This option is primarily used to share source code with Edgio support personnel for the purpose of debugging. If omitted,
  // edgio deploy --includeSources will result in all files which are not gitignored being uploaded to Edgio.
  //
  // sources : [
  //   '**/*', // include all files
  //   '!(**/secrets/**/*)', // except everything in the secrets directory
  // ],
};
