const { createDevServer } = require("@edgio/core/dev");

module.exports = function () {
  return createDevServer({
    // All console output from your app will be prefixed with this label
    label: "Frontity",

    // The command to start your app in dev mode
    command: (port) => `npx frontity dev --port=${port}`,

    // Once your app's console output has matched all of the following patterns, the "Edgio ready on ..." message will be displayed
    ready: [/SERVER STARTED/i],
  });
};
