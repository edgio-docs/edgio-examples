// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: '@edgio/next',
  routes: './edgio/routes.js',
  origins: [
    {
      name: 'api',
      override_host_header: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
      hosts: [
        {
          location: {
            hostname: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
          },
        },
      ],
    },
    {
      name: 'image',
      override_host_header: 'opt.moovweb.net',
      hosts: [
        {
          location: { hostname: 'opt.moovweb.net' },
        },
      ],
    },
    {
      name: 'sampleapis',
      override_host_header: 'api.sampleapis.com',
      hosts: [
        {
          location: { hostname: 'api.sampleapis.com' },
        },
      ],
    },
    {
      name: 'imdb',
      override_host_header: 'search.imdbot.workers.dev',
      hosts: [
        {
          location: { hostname: 'search.imdbot.workers.dev' },
        },
      ],
    },
  ],
}
