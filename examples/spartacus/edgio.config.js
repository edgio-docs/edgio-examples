"use strict";

// This file was automatically added by edgio deploy.
// You should commit this file to source control.

module.exports = {
  connector: "@edgio/spartacus",
  origins: [
    {
      name: "commerce",
      override_host_header: "spartacus-demo.eastus.cloudapp.azure.com",
      hosts: [{ location: "spartacus-demo.eastus.cloudapp.azure.com" }],
    },
  ],
};
