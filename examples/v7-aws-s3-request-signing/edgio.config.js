// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
require('dotenv').config();

const { S3_HOSTNAME } = process.env;

module.exports = {
  purgeCacheOnDeploy: true,

  origins: [
    {
      // The name of the backend origin
      name: 'origin',

      // Use the following to override the host header sent from the browser when connecting to the origin
      override_host_header: 'http-echo.raees.me',

      // The list of origin hosts to which to connect
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: 'http-echo.raees.me',
        },
      ],

      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: 'http-echo.raees.me',
      },
    },
    {
      // The name of the backend origin
      name: 's3',

      // Use the following to override the host header sent from the browser when connecting to the origin
      override_host_header: S3_HOSTNAME,

      // The list of origin hosts to which to connect
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: S3_HOSTNAME,
        },
      ],

      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: S3_HOSTNAME,
      },
    },
  ],
};
