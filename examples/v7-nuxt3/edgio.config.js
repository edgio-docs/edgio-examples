// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: '@edgio/nuxt-nitro',
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
      },
    },
  ],
}
