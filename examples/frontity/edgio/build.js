const { DeploymentBuilder } = require("@edgio/core/deploy");
const FrameworkBuildError = require("@edgio/core/errors/FrameworkBuildError");

module.exports = async function build({ skipFramework }) {
  const builder = new DeploymentBuilder();
  builder.clearPreviousBuildOutput();

  if (!skipFramework) {
    // run the frontity build
    try {
      await builder.exec("npx frontity build");
    } catch (e) {
      // this lets the user know that the build error was within their application code, not their edgio router or configuration.
      throw new FrameworkBuildError("Frontity");
    }
  }

  builder
    // optionally add some file required by the app at runtime.  This is equivalent to setting the includeFiles config in edgio.config.js
    .addJSAsset("build");

  // build the edgio deployment bundle in the .edgio directory
  await builder.build();
};
