module.exports = {
  connector: '@edgio/react-cra',
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
}
