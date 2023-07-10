// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config
module.exports = {
  connector: "@edgio/next",
  origins: [
    {
      name: "legacy",
      override_host_header: "origin.mockaroo.com",
      hosts: [
        {
          location: "origin.mockaroo.com",
        },
      ],
    },
  ],
};
