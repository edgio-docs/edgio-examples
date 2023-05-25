// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: '@edgio/next',

  // The name of the site in Edgio to which this app should be deployed.
  // name: 'my-site-name',

  // The name of the team in Edgio to which this app should be deployed.
  // team: 'my-team-name',

  // Overrides the default path to the routes file. The path should be relative to the root of your app.
  // routes: 'routes.js',

  next: {
    // Output sourcemaps so that stack traces have original source filenames and line numbers when tailing
    // the logs in the Edgio developer console.
    // This config options replaces the edgioSourceMaps option in next.config.js.
    // @default true
    generateSourceMaps: false,
    //
    // Disables the Edgio image optimizer and allows to use the Next's built in image optimizer.
    // This config options replaces the disableImageOptimizer option in edgio.config.js root.
    // @default false
    // disableImageOptimizer: false
    //
    // Disables the Edgio development tools widget on the site.
    // This config options replaces the disableEdgioDevTools option in next.config.js.
    // @default false
    // disableDevtools: true
    //
    // Disables the build of the service worker.
    // @default false
    // disableServiceWorker: false
    //
    // Forces the @edgio/next connector to use the server build.
    // This config option replaces the NEXT_FORCE_SERVER_BUILD env variable.
    // @default false
    // forceServerBuild: false
    //
    // Optimizes the server build by bundling all server assets and decreasing the overall startup time.
    // This option has no effect on apps with serverless build.
    // This option is set to false for Next 13.x apps.
    // @default true
    // optimizeServerBuild: true
  },

  // If you need to proxy some URLs to an origin instead of your Next.js app, you can configure the origins here:
  origins: [
    {
      name: 'api',
      override_host_header: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
      hosts: [
        {
          scheme: 'match',
          location: [
            {
              hostname: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
            },
          ],
        },
      ],
      tls_verify: {
        allow_self_signed_certs: true,
        use_sni: true,
        sni_hint_and_strict_san_check: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
      },
    },
    {
      name: 'image',
      override_host_header: 'opt.moovweb.net',
      hosts: [
        {
          scheme: 'match',
          location: [
            {
              hostname: 'opt.moovweb.net',
            },
          ],
        },
      ],
      tls_verify: {
        allow_self_signed_certs: true,
        use_sni: true,
        sni_hint_and_strict_san_check: 'opt.moovweb.net',
      },
    },
  ],

  // Options for hosting serverless functions on Edgio
  // serverless: {
  //   // Set to true to include all packages listed in the dependencies property of package.json when deploying to Edgio.
  //   // This option generally isn't needed as Edgio automatically includes all modules imported by your code in the bundle that
  //   // is uploaded during deployment
  //   includeNodeModules: true,
  //
  //   // Include additional paths that are dynamically loaded by your app at runtime here when building the serverless bundle.
  //   include: ['views/**/*'],
  // },

  // The maximum number of URLs that will be concurrently prerendered during deployment when static prerendering is enabled.
  // Defaults to 200, which is the maximum allowed value.
  // prerenderConcurrency: 200,

  // A list of glob patterns identifying which prerenderConcurrency source files should be uploaded when running edgio deploy --includeSources.
  // This option is primarily used to share source code with Edgio support personnel for the purpose of debugging. If omitted,
  // edgio deploy --includeSources will result in all files which are not gitignored being uploaded to Edgio.
  //
  // sources : [
  //   '**/*', // include all files
  //   '!(**/secrets/**/*)', // except everything in the secrets directory
  // ],
}
