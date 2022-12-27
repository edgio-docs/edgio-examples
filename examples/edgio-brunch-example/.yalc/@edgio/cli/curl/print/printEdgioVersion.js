"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printEdgioVersion;

var _chalk = require("chalk");

var _logo = _interopRequireDefault(require("../../utils/logo"));

var _interpolate = _interopRequireDefault(require("../interpolate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// interpolate with gray color default
const iGray = tpl => (0, _interpolate.default)((0, _chalk.gray)(tpl));

function printEdgioVersion(curlResponse, {
  logger,
  internalArgs
}) {
  if (!internalArgs.x0v) {
    return;
  }

  const x0version = curlResponse.lastHeaderGroup().headers.findByName('x-0-version');

  if (!x0version) {
    return;
  }

  const x0VersionParts = x0version.value.split(' ');
  logger.info((0, _chalk.cyan)(`${_logo.default} Version`)); // Bit flaky to identify edge served the request from x-0-version header, but should work fine
  // TODO: This needs to be refactored. This is not working since on llnw we have a same length x-0-version as example:
  //  > "1866 4.13.9 14 2022-05-11T20" (buildNumber , packageVersion, environmentVersion, compiledAt) (see "0 curl docs.edg.io") (LLNW)
  //
  // Other Options:
  //  > 17 4.13.10-next-1651728728-6f380d451.0 3 2022-05-05T10:56:59.583Z 1.4.0 (build number, package version, environmentVversion, compiledAt, compilerVersion) (LLNW)
  //  > 26 3.16.5 2021-11-10T13:22:29.894Z 15 (buildNumber, packageVersion, compiledAt/deployedAt?, serviceVersion in Fast*y)
  // Leaving old code here that should be refactored or even dropped?
  // Disable prettier, so this output will remain readable
  // prettier-ignore
  // if (x0VersionParts.length === 5) {
  //   const [build, packageVersion, envVersion, compiledAt, compilerVersion] = x0VersionParts
  //   // logger.info(iGray('  Edge                {v}')({ v: green('Limelight') }))
  //   logger.info(iGray('  Build Number        {v}')({ v: cyan(build) }))
  //   logger.info(iGray('  Package Version     {v}')({ v: cyan(packageVersion) }))
  //   logger.info(iGray('  Environment Version {v}')({ v: cyan(envVersion) }))
  //   logger.info(iGray('  Compiler Version    {v} ({at})')({ v: cyan(compilerVersion), at: compiledAt }))
  // } else if (x0VersionParts.length === 4) {
  //   const [ build, packageVersion, serviceVersion, compiledAt ] = x0VersionParts
  //   // logger.info(iGray('  Edge                {v}')({ v: red('Legacy XDN') }))
  //   logger.info(iGray('  Build Number        {v}')({ v: cyan(build) }))
  //   logger.info(iGray('  Package Version     {v}')({ v: cyan(packageVersion) }))
  //   logger.info(iGray('  Service Version     {v} ({at})')({ v: cyan(serviceVersion), at: compiledAt }))
  // } else {
  //   logger.debug('Unknown x-0-version', x0VersionParts)
  // }
  // Since code above doesn't work and until we don't fix it, we can send information we still know

  const [build, packageVersion] = x0VersionParts;
  logger.info(iGray('  Build Number        {v}')({
    v: (0, _chalk.cyan)(build)
  }));
  logger.info(iGray('  Package Version     {v}')({
    v: (0, _chalk.cyan)(packageVersion)
  }));
  logger.info('');
}

module.exports = exports.default;