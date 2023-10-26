// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  // The name of the site in Edgio to which this app should be deployed.
  name: 'edgio-v7-image-optimization-example',

  origins: [
    {
      name: 'wiki',
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
      name: 'wikiupload',
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
};
