// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: '@edgio/nuxt-nitro',
  // If you need to proxy some URLs to an origin instead of your Nuxt3 app, you can configure the origins here:
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
