"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const path = require('path');

const fse = require('fs-extra');

const {
  compact,
  get,
  isEmpty,
  find,
  uniq
} = require('lodash');

const {
  EOL
} = require('os');

const sleep = require('../utils/sleep');

const packageProject = require('../utils/packageProject');

const git = require('../utils/git');

const EdgioPackageJson = require('../utils/EdgioPackageJson');

const getCoreEdgioVersion = require('../utils/getCoreEdgioVersion');

const buildProject = require('../utils/build');

const {
  readEdgioVersion: readEdgioVersion
} = require('../utils/edgio');

const authenticate = require('../prompts/authenticate');

const detectFramework = require('../frameworks/detectFramework');

const {
  DeployError,
  ValidationError,
  EdgioCLIError,
  EdgioBuildError
} = require('../utils/errors');

const stdStreamsObserver = require('../utils/stdStreamsObserver');

const announceSuccessfulDeployment = require('../utils/announceSuccessfulDeployment');

const announceFailedDeployment = require('../utils/announceFailedDeployment');

const announceCanceledDeployment = require('../utils/announceCanceledDeployment');

const {
  isMonorepo,
  locateAppToRunCmd
} = require('../utils/monorepo');

const buildCommand = require('./build');

const getRouterInfo = require('../utils/getRouterInfo');

const writeDeploymentManifest = require('../utils/writeDeploymentManifest');

const {
  yesNoQuestion
} = require('../utils/prompts');

const getEdgioConfig = require('../utils/getEdgioConfig');

const Validator = require('../utils/validator');

exports.command = 'deploy [team]';
exports.describe = 'Deploys your project to Edgio';
exports.builder = _objectSpread(_objectSpread({}, buildCommand.builder), {}, {
  skipFramework: _objectSpread(_objectSpread({}, buildCommand.builder.skipFramework), {}, {
    alias: 'sf'
  }),
  site: {
    type: 'string',
    alias: 's',
    describe: 'Slug of the site to deploy to, using package.json name property by default.'
  },
  'skip-build': {
    type: 'boolean',
    describe: 'Skips rebuilding your app and deploys the previous build instead.'
  },
  path: {
    type: 'string',
    describe: "Path to your site's root directory. Uses current directory by default.",
    default: '.'
  },
  team: {
    type: 'string',
    alias: 't',
    describe: 'The name of the team under which the site will be deployed. The site will be deployed to your private space if omitted.'
  },
  branch: {
    type: 'string',
    alias: 'b',
    describe: 'The name of the source control branch. This is automatically set when using Git.'
  },
  environment: {
    type: 'string',
    alias: 'e',
    describe: 'Environment to deploy to. Uses default environment if omitted.'
  },
  'commit-url': {
    type: 'string',
    describe: `Custom commit url. Automatically works for github, bitbucket and gitlab. Git SHA is appended at the end of the provided url.${EOL}` + 'Example: https://github.com/jlord/sheetsee.js/commit/'
  },
  'disable-team-check': {
    type: 'boolean',
    describe: 'Skips the check to see if the site is being deployed to a personal team and also exists on a shared team.',
    default: false
  }
}); // Per https://nodejs.org/api/process.html#process_signal_events we chose
// the following signals to be handled:

const HANDLED_PROCESS_SIGNAL_EVENTS = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGBREAK'];

class DeployCommand {
  constructor(yargs) {
    _defineProperty(this, "_wrappedRun", async () => {
      let {
        path: givenPath,
        team: teamSlug,
        site,
        branch,
        environment,
        skipBuild,
        commitUrl: customCommitUrl
      } = this._yargs;
      const {
        logger
      } = this._context;
      const framework = await detectFramework();

      this._context.setLoginAction('deploy');

      await authenticate(this._context);

      if (isMonorepo()) {
        await locateAppToRunCmd('deploy');
      }

      const absolutePath = path.resolve(process.cwd(), givenPath); // Check that package.json is existing or fail the deployment

      const packageJson = EdgioPackageJson.loadPackageJson(givenPath);
      const coreEdgioVersion = getCoreEdgioVersion();

      if (isEmpty(coreEdgioVersion)) {
        throw new DeployError('@edgio/core module has not been installed, please run "edgio init".');
      }

      const config = getConfig(logger);
      const validator = new Validator(logger, {
        exitOnError: true
      }); // Validate the backends are potentially reachable. This may log a warning
      // prior to deployment, but will continue even if validation fails.

      await validator.validateBackends(config); // If --site is provided override default $npm_package_name

      const siteSlug = validator.validateSiteName(site || config.name || packageJson.name);
      const branchName = branch || (await git.currentBranch(absolutePath));
      const isDirtyCommit = await git.isDirty();
      const commitUrl = isDirtyCommit ? undefined : await git.commitUrl(absolutePath, customCommitUrl);
      teamSlug = teamSlug || config.team || (await this.checkIfSiteExistsOnAnotherTeam(siteSlug));
      await logger.title('📋 Deploying to:');
      logger.info([`> Team: ${teamSlug || 'Private space'}`, `> Site: ${siteSlug}`, branchName && `> branch: ${branchName}`, `> Environment: ${environment || 'default'}`, `> Edgio version: ${coreEdgioVersion}`, commitUrl && `> Commit URL: ${commitUrl}`].filter(Boolean) // Removes falsy values
      .join(EOL));
      const {
        build: {
          id: buildId,
          number: buildNumber
        },
        s3SelfSignedProjectPost,
        deprecationWarning,
        environmentVariables
      } = await this._context.api.createBuild({
        siteSlug,
        teamSlug,
        environment,
        edgioVersion: coreEdgioVersion,
        branch: branchName,
        framework: get(framework, 'key'),
        commitUrl
      });
      logger.info(`> Deployment #${buildNumber}`); // Capture the build ID immediately so that we can fail the build on any errors.

      this._buildId = buildId; // copy environment variables from console into process.env so code can access them at build time

      for (let {
        key,
        value
      } of environmentVariables) {
        if (value != null) {
          process.env[key] = value;
        }
      }

      if (deprecationWarning) {
        logger.warn(deprecationWarning);
      }

      let buildStep = async () => {
        if (!skipBuild) {
          const streamsObserver = stdStreamsObserver([process.stdout, process.stderr]);

          try {
            await buildProject(this._yargs);
          } catch (e) {
            if (e.type === 'FrameworkBuildError') {
              throw new DeployError(e.message, {
                addToLeDeployerLogs: streamsObserver.getOutput()
              });
            } else {
              throw new DeployError('Project build failed', {
                errorDetails: e.stack || e.message,
                addToLeDeployerLogs: streamsObserver.getOutput()
              });
            }
          } finally {
            streamsObserver.detach();
          } // Push Build output when framework build was success


          await this._context.api.updateBuild(this._buildId, {}, streamsObserver.getOutput());
        }
      };

      const zippingStep = async () => {
        // Check that Edgio versions match unless we are overriding the versions for platform development.
        if (isEmpty(process.env.EDGIO_VERSION_OVERRIDE)) {
          const builtEdgioVersion = await readEdgioVersion(absolutePath);

          if (coreEdgioVersion !== builtEdgioVersion) {
            throw new DeployError(`Please rebuild with Edgio v${coreEdgioVersion}`);
          }
        } // Puts projectRoot/.Edgio folder into zip


        const projectZipFile = await packageProject(absolutePath, this._yargs);
        return {
          projectZipFile
        };
      };

      const uploadingStep = ({
        projectZipFile,
        s3SelfSignedProjectPost
      }) => logger.step('📡️ Uploading...', async () => {
        const routerInfo = await getRouterInfo(absolutePath);
        const zipFileStream = fse.createReadStream(projectZipFile);
        await this._context.api.presignedUploadToS3(s3SelfSignedProjectPost, zipFileStream);
        await this._context.api.updateBuild(buildId, {
          status: 'uploaded',
          routerInfo
        });
        await fse.remove(projectZipFile);
      });

      const deployingStep = () => logger.step('⌛ Deploying...', async () => {
        // Now that we have finished with uploading and we are just waiting we should
        // not fail the builds if CLI fails or is interrupted.
        this._deregisterProcessSignalHandlers();

        await this._streamLogsUntilStatus(['completed']);
      }); // Run the steps with as much parallelism as possible
      // Packaging step requires the build


      const {
        projectZipFile
      } = await buildStep().then(zippingStep);
      await uploadingStep({
        s3SelfSignedProjectPost,
        projectZipFile
      });
      await deployingStep();
      const build = await this.getBuild({
        refresh: true
      });
      logger.info(EOL + announceSuccessfulDeployment(build) + EOL);
      writeDeploymentManifest(absolutePath, build);
    });

    _defineProperty(this, "_streamLogsUntilStatus", async statuses => {
      const {
        logger
      } = this._context; // TODO: use subscriptions?

      const LOG_PULL_DELAY = 5000;
      let build;

      while (!build || !statuses.includes(build.status)) {
        await sleep(LOG_PULL_DELAY);
        build = await this.getBuild({
          refresh: true
        });
        const logs = compact(build.logs.split('\n'));
        const newLogs = logs.slice(this._displayedLogsCount || 0);
        newLogs.forEach(newLog => logger.debug(newLog));
        this._displayedLogsCount = logs.length;

        if (build.status === 'failed') {
          throw new EdgioBuildError(build);
        }
      }

      return build;
    });

    this._yargs = yargs;
    this._buildId = null;
    this._context = this._yargs.context;
  }
  /**
   * Performs the deploy command. It correctly fails the build (if it has been started)
   * on any error.
   */


  async run() {
    // Register all the signal events for handling before starting the run.
    this._registerProcessSignalHandlers();

    try {
      await this._wrappedRun();
    } catch (e) {
      await this._failBuild(e);
      throw e;
    } finally {
      this._deregisterProcessSignalHandlers();
    }
  }
  /**
   * Handler for all the process signal that we handle during the process.
   *
   * @param {String} signal ID of the signal that was raised
   */


  _processSignalHandler(signal) {
    const error = new EdgioCLIError(`${signal} raised`);

    this._cancelBuild(error).then(() => {
      process.exit(1);
    });
  }
  /**
   * Registers process signal handlers.
   *
   * Notes:
   * - Deregistering requires the exact same binding as registering
   * as process.on doesn't return a handler that we could use.
   * This is why all the handlers are exactly the same.
   */


  _registerProcessSignalHandlers() {
    HANDLED_PROCESS_SIGNAL_EVENTS.forEach(signal => {
      process.on(signal, this._processSignalHandler.bind(this));
    });
  }
  /**
   * Deregisters process signal handlers.
   *
   * Notes:
   * - The deregistering is idempotent and we call it from multiple places.
   */


  _deregisterProcessSignalHandlers() {
    HANDLED_PROCESS_SIGNAL_EVENTS.forEach(signal => {
      process.listeners(signal).map(handler => process.off(signal, handler));
    });
  }

  async _failEdgioBuild(e) {
    // EdgioBuildError are already originating from a failed build on Edgio so we don't need
    // to push that information back to LeDeployer. It would also result in duplicated logs
    if (e instanceof EdgioBuildError) {
      return;
    }

    try {
      let message = 'Build failed';
      message += ` with error: ${e.message}`;

      if (e.errorDetails) {
        message += `\n${e.errorDetails}`;
      }

      if (e.addToLeDeployerLogs) {
        message += `\n${e.addToLeDeployerLogs}`;
      }

      if (e.stack && !e.isUserError) {
        // An error that occurred in the normal user workflow:
        // (failed sign-in, team slug not found, javascript build failure, etc...)
        // in which case we don't want to display a stack trace but just a specific error message and details
        message += e.stack;
      }

      await this._context.api.updateBuild(this._buildId, {
        status: 'failed'
      }, message);
    } catch (e) {
      console.error(`Update build failed: ${e.message}`);
    }
  }

  async _cancelBuild(e) {
    if (!this._buildId) return;

    try {
      let message = `Build canceled with error: ${e.message}`;
      await this._context.api.updateBuild(this._buildId, {
        status: 'canceled'
      }, message);
    } catch (e) {
      console.error(`Update build failed: ${e.message}`);
    }

    const build = await this.getBuild();
    await this._context.logger.info(EOL + announceCanceledDeployment(build.consoleUrl) + EOL);
  }

  async _failBuild(e) {
    if (!this._buildId) {
      return;
    }

    const build = await this.getBuild(); // When build is already uploaded, CLI should not be able to fail the build on errors.

    if (['initializing', 'initialized', 'uploading'].includes(build.status)) {
      await this._failEdgioBuild(e);

      this._context.logger.info(EOL + announceFailedDeployment(build.consoleUrl) + EOL);
    }
  }

  async getBuild({
    refresh = false
  } = {}) {
    if (!this._buildId) return;

    if (this._build && !refresh) {
      return this._build;
    }

    this._build = await this._context.api.getBuild(this._buildId);
    return this._build;
  }

  async checkIfSiteExistsOnAnotherTeam(siteSlug) {
    const {
      team: teamSlug,
      disableTeamCheck
    } = this._yargs;
    const {
      logger,
      api,
      nonInteractive
    } = this._context;
    /**
     * Below we check to see which site the user is deploying to
     * and if deploying to a personal space, check to see if the
     * same site exists on other teams the user belongs to. If
     * the site exists on another team, prompt the user to confirm
     * if they are wanting to continue deploying to their private
     * space or if they intended to deploy to a shared team.
     */
    // skip this check if:
    // - deploy token was specified
    // - team was specified
    // - --disable-team-check=true

    if (nonInteractive || teamSlug || disableTeamCheck) {
      return teamSlug;
    }

    const [teamData, personalTeam] = await Promise.all([api.getTeamsSitesEnvs(), api.getPersonalTeam()]);
    const {
      slug: personalTeamSlug
    } = personalTeam; // filter personal team from available teams

    const teams = teamData.nodes.filter(site => site.slug !== personalTeamSlug); // look for site name in other teams and record each matching team

    const siteInTeams = [];
    find(teams, team => find(team.sites.nodes, site => {
      if (site.slug === siteSlug) {
        siteInTeams.push(team.slug);
      }
    })); // dedup teams (shouldn't be possible) and confirm if the user
    // would like to change which team to deploy to

    for (let team of uniq(siteInTeams)) {
      const confirmed = await yesNoQuestion(logger.highlight('yellow', `WARNING: A site named '${siteSlug}' is also deployed to team '${team}'. ` + `Are you sure you want to deploy this site to your private space?${EOL}`), {
        initial: false
      }); // new line for readability

      console.log();

      if (confirmed) {
        return teamSlug;
      } else {
        process.exit(0);
      }
    }
  }

}

const validate = yargs => {
  const commitUrl = yargs.commitUrl;

  if (commitUrl && !/(http|https):\/\//.test(commitUrl)) {
    throw new ValidationError('Invalid commit url protocol');
  }
};

exports.handler = async yargs => {
  validate(yargs);
  const command = new DeployCommand(yargs);
  await command.run();
};
/**
 * Returns the contents of edgio.config.js, or, if not present, exits with
 * an error message.
 * @returns
 */


function getConfig(logger) {
  const config = getEdgioConfig();

  if (!config) {
    logger.error(`Error: edgio.config.js not found. Please run "edg init" to initialize your Edgio project.\n`);
    process.exit(1);
  }

  return config;
}