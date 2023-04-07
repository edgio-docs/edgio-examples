// edgio.config.js
module.exports = {
  origins: [
    {
      name: "origin",
      override_host_header: "publicdomainreview.org",
      hosts: [
        {
          location: [
            {
              hostname: "publicdomainreview.org"
            }
          ]
        }
      ]
    }
  ],
  name: "edgio-v7-simple-performance-example"
};
//# sourceMappingURL=edgio.config.js.map
