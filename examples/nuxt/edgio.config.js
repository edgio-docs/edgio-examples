// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  routes: './edgio/routes.js',
  connector: '@edgio/nuxt',

  origins: [
    {
      // The name of the backend origin
      name: 'api',

      // Override the host header sent from the browser when connecting to the origin
      override_host_header: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
      // The list of origin hosts to which to connect
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: 'edgio-community-ecommerce-api-example-default.layer0-limelight.link',
        },
      ],
    },
    {
      // The name of the backend origin
      name: 'image',

      // Override the host header sent from the browser when connecting to the origin
      override_host_header: 'opt.moovweb.net',
      // The list of origin hosts to which to connect
      hosts: [
        {
          // The domain name or IP address of the origin serve r
          location: 'opt.moovweb.net',
        },
      ],
    },
  ],
}
