// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
require('dotenv').config();

module.exports = {
  // The name of the site in Edgio to which this app should be deployed.
  name: 'edgio-functions-examples',

  // The name of the team in Edgio to which this app should be deployed.
  team: 'edge-functions-sandbox',

  // Overrides the default path to the routes file. The path should be relative to the root of your app.
  // routes: 'routes.js',

  origins: [
    {
      // The name of the backend origin
      name: 'dummy-json',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: 'edgio-functions-dummy-json-default.edgio.link',

      // The list of backend hosts
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: 'edgio-functions-dummy-json-default.edgio.link',
        },
      ],
    },
    {
      name: 'planetscale',
      override_host_header: 'aws.connect.psdb.cloud',
      hosts: [
        {
          location: 'aws.connect.psdb.cloud',
        },
      ],
    },
    {
      name: 'upstash',
      override_host_header: 'simple-weasel-38863.upstash.io',
      hosts: [
        {
          location: 'simple-weasel-38863.upstash.io',
        },
      ],
    },
    {
      name: 'google',
      override_host_header: 'www.google.com',
      hosts: [
        {
          location: 'www.google.com',
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: 'www.google.com',
      },
    },
  ],

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

  // A list of glob patterns identifying which source files should be uploaded when running edgio deploy --includeSources.
  // This option is primarily used to share source code with Edgio support personnel for the purpose of debugging. If omitted,
  // edgio deploy --includeSources will result in all files which are not gitignored being uploaded to Edgio.
  //
  // sources : [
  //   '**/*', // include all files
  //   '!(**/secrets/**/*)', // except everything in the secrets directory
  // ],
};
