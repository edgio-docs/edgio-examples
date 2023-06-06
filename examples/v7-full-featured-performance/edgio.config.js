module.exports = {
  connector: '@edgio/starter',
  origins: [
    {
      name: 'origin',
      override_host_header: 'www.smashingmagazine.com',
      hosts: [
        {
          location: 'www.smashingmagazine.com',
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: 'www.smashingmagazine.com',
      },
    },
    {
      name: 'assets',
      override_host_header: 'files.smashing.media',
      hosts: [
        {
          location: 'files.smashing.media',
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: 'files.smashing.media',
      },
    },
  ],
}
