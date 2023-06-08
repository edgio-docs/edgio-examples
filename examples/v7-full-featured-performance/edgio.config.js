module.exports = {
  connector: '@edgio/starter',
  origins: [
    {
      name: 'origin',
      override_host_header: 'en.wikipedia.org',
      hosts: [
        {
          location: 'en.wikipedia.org',
        },
      ],
      tls_verify: {
        use_sni: true,
        allow_self_signed_certs: true,
        sni_hint_and_strict_san_check: 'en.wikipedia.org',
      },
    },
    {
      name: 'upload',
      override_host_header: 'upload.wikimedia.org',
      hosts: [
        {
          location: 'upload.wikimedia.org',
        },
      ],
      tls_verify: {
        use_sni: true,
        allow_self_signed_certs: true,
        sni_hint_and_strict_san_check: 'upload.wikimedia.org',
      },
    },
  ],
}
