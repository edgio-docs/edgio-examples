"use strict";

// This file was automatically added by edgio deploy.
// You should commit this file to source control.

module.exports = {
  connector: "@edgio/spartacus",
  backends: {
    commerce: {
      domainOrIp: "spartacus-demo.eastus.cloudapp.azure.com",
      hostHeader: "spartacus-demo.eastus.cloudapp.azure.com",
      port: 8443,
      disableCheckCert: true,
    },
  },
};
