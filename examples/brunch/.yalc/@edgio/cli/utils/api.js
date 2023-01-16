"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  forEach,
  get,
  mapValues
} = require('lodash');

const axios = require('axios');

const FormData = require('form-data');

const util = require('util');

const cliProgress = require('cli-progress');

const {
  yesNoQuestion
} = require('../utils/prompts');

const {
  EOL
} = require('os');

const {
  EdgioCLIError,
  LeDeployerApiError,
  BadRequestError,
  AuthenticationError
} = require('./errors');

const REQUEST_RETRY_DELAY = 1000;
const CURRENT_ACTOR_QUERY =
/* GraphQL */
`
  query currentActor {
    currentActor {
      name
    }
  }
`;
const PERSONAL_TEAM_QUERY =
/* GraphQL */
`
  query currentUser {
    currentUser {
      personalTeam {
        id
        name
        slug
        tier
        personal
      }
    }
  }
`;
const CREATE_BUILD_QUERY =
/* GraphQL */
`
  mutation createBuild(
    $teamSlug: String
    $siteSlug: String!
    $branch: String
    $environment: String
    $edgioVersion: String!
    $framework: String
    $commitUrl: String
    $bypassUserErrors: Boolean
  ) {
    createBuild(
      teamSlug: $teamSlug
      siteSlug: $siteSlug
      branch: $branch
      environment: $environment
      xdnVersion: $edgioVersion
      framework: $framework
      commitUrl: $commitUrl
      bypassUserErrors: $bypassUserErrors
    ) {
      build {
        id
        number
        status
        consoleUrl
        environment {
          name
          initialized
        }
        environmentVersion {
          environmentVariables {
            nodes {
              key
              value
            }
          }
        }
      }
      s3SelfSignedProjectPost
      deprecationWarning
      userErrors {
        message
        bypassable
        code
      }
    }
  }
`;
const UPDATE_BUILD_QUERY =
/* GraphQL */
`
  mutation updateBuild($build: UpdateBuildAttributes!, $addToLogs: String) {
    updateBuild(build: $build, addToLogs: $addToLogs) {
      build {
        id
        status
      }
      userErrors {
        message
      }
    }
  }
`;
const GET_BUILD_QUERY =
/* GraphQL */
`
  query build($buildId: ID!) {
    build(id: $buildId) {
      status
      url
      consoleUrl
      logs
      number
      buildError
      environment {
        name
        default
        activeUrls
        dnsDomainName
        initialized
      }
    }
  }
`;
const PURGE_BY_PATH = 'path';
const PURGE_BY_SURROGATE_KEY = 'surrogate_key';
const PURGE_ALL_ENTRIES = 'all_entries';
const PURGE_CACHE_QUERY =
/* GraphQL */
`
  mutation purgeCache(
    $teamSlug: String
    $siteSlug: String
    $environmentName: String
    $purgeBy: PurgeByEnum!
    $values: [String!]!
  ) {
    purgeCache(
      teamSlug: $teamSlug
      siteSlug: $siteSlug
      environmentName: $environmentName
      purgeBy: $purgeBy
      values: $values
    ) {
      success
      purgeId
      userErrors {
        message
      }
    }
  }
`;
const PURGE_CACHE_STATUS_QUERY =
/* GraphQL */
`
  query cachePurgeStatus($cachePurgeId: ID!) {
    edgeCachePurge: cachePurgeStatus(cachePurgeId: $cachePurgeId) {
      progressPct
    }
  }
`;
const GET_TEAMS_SITES_ENVIRONMENTS =
/* GraphQL */
`
  query teams {
    teams {
      nodes {
        slug
        sites {
          nodes {
            id
            slug
            environments {
              nodes {
                id
                name
                production
              }
            }
          }
        }
      }
    }
  }
`; // This endpoint is not guaranteed to be supported by console-team. Do not expose functionality to the
// customers without previous consultation with console-team. APPOPS-15456

const ADD_ENVIRONMENT =
/* GraphQL */
`
  mutation createEnvironment($environment: CreateEnvironmentAttributes!, $copyEnvironment: ID) {
    createEnvironment(environment: $environment, copyEnvironment: $copyEnvironment) {
      environment {
        id
        name
        limelightDefaultDomainName
      }
      userErrors {
        message
      }
    }
  }
`;
const DELETE_ENVIRONMENT =
/* GraphQL */
`
  mutation deleteEnvironment($id: ID!) {
    deleteEnvironment(id: $id)
  }
`;
const SET_PRODUCTION_ENVIRONMENT =
/* GraphQL */
`
  mutation setProductionEnvironment($id: ID!) {
    setProductionEnvironment(id: $id) {
      userErrors {
        message
      }
    }
  }
`;
const GET_ENVIRONMENT_VARIABLES =
/* GraphQL */
`
  query environmentByName($teamSlug: String, $siteSlug: String!, $environment: String!) {
    environment: environmentByName(teamSlug: $teamSlug, siteSlug: $siteSlug, name: $environment) {
      id
      environmentVariables(first: 1000, orderBy: [{ key: asc }]) {
        nodes {
          id
          key
          value
          secret
        }
      }
    }
  }
`;

class Api {
  constructor(context) {
    this.context = context;
  }

  async _post(url, payload, options = {}) {
    const {
      maxRetries = 0,
      headers = {}
    } = options;
    const {
      apiKey,
      apiUrl
    } = this.context;
    const config = {
      baseURL: apiUrl,
      headers
    };

    if (apiKey) {
      config.headers['X-API-KEY'] = apiKey;
    }

    config.headers['Accept'] = 'application/json';

    try {
      const res = await axios.post(url, payload, config);
      return res;
    } catch (e) {
      // Here we're looking for 502, 503, 504 that are worth retrying
      if (maxRetries > 0 && (['ECONNREFUSED', 'ETIMEDOUT'].includes(e.code) || e.response && e.response.status > 501)) {
        await new Promise(r => setTimeout(r, REQUEST_RETRY_DELAY));
        return this._post(url, payload, _objectSpread(_objectSpread({}, options), {}, {
          maxRetries: maxRetries - 1
        }));
      }

      if (e.response && e.response.status === 401) {
        throw new AuthenticationError(e.message);
      }

      let responseDetails = e.message;

      if (e.response) {
        responseDetails = `${e.response.status} - ${JSON.stringify(e.response.data)}`;
      } // Axios throws an exception for 500s and connection issues


      throw new LeDeployerApiError('Something went wrong while connecting to our server.\nPlease try again later and contact support if the problem persists.', {
        errorDetails: `Unexpected error from API: ${responseDetails}`
      });
    }
  }

  async _postGraphqlQuery(query, {
    variables = {},
    files = null,
    maxRetries = 0
  } = {}) {
    this.context.logger.graphqlQuery(query, variables, files);
    let payload = {
      query,
      variables
    };
    let headers = {};

    if (files) {
      // Implementing spec https://github.com/jaydenseric/graphql-multipart-request-spec
      // to post FILES within a GraphQL mutation.
      const form = new FormData();
      form.append('operations', JSON.stringify({
        query,
        variables: _objectSpread(_objectSpread({}, variables), mapValues(files, () => null))
      }));
      const fileKeys = Object.keys(files);
      const fileMap = {};
      fileKeys.forEach((fileKey, index) => {
        const indexString = index.toString(10);
        fileMap[indexString] = [`variables.${fileKey}`];
        form.append(indexString, files[fileKey]);
      });
      form.append('map', JSON.stringify(fileMap));
      payload = form;
      headers = form.getHeaders();
    }

    const res = await this._post('/graphql', payload, {
      headers,
      maxRetries
    });
    const graphQlResponse = res.data;
    this.context.logger.graphqlResponse(graphQlResponse);

    if (graphQlResponse.errors) {
      // For queries, userErrors come back as root errors in graphql response...
      // For mutations, they usually comes as part of data.userErrors.
      throw new EdgioCLIError(`Error: ${graphQlResponse.errors.map(error => error.message).join('\n')}`);
    }

    return graphQlResponse;
  }

  _onErrors(userErrors) {
    if (userErrors && userErrors.length) {
      // Just show the first error for now
      throw new BadRequestError(userErrors[0].message);
    }
  }

  async currentActor() {
    const res = await this._postGraphqlQuery(CURRENT_ACTOR_QUERY, {
      maxRetries: 2
    });
    return get(res, ['data', 'currentActor']);
  }
  /**
   * Creates and deploys a project build
   * @param {object} options
   * @param {string} options.siteSlug Slug of the Site to deploy to
   * @param {string} options.teamSlug Team where the Site belongs to. (default: personal team)
   * @param {string} options.branch Branch to deploy to. (default: 'cli' branch)
   * @param {string} options.framework Framework name.
   */


  async createBuild(createBuildParams) {
    const {
      siteSlug,
      teamSlug,
      branch,
      environment,
      edgioVersion,
      framework,
      commitUrl,
      bypassUserErrors = false
    } = createBuildParams;
    const res = await this._postGraphqlQuery(CREATE_BUILD_QUERY, {
      variables: {
        siteSlug,
        // Uses personal team as a default
        teamSlug,
        branch,
        environment,
        edgioVersion,
        framework,
        commitUrl,
        bypassUserErrors
      }
    });
    const {
      userErrors,
      build,
      s3SelfSignedProjectPost,
      deprecationWarning
    } = res.data.createBuild;

    if (userErrors && userErrors[0] && userErrors[0].bypassable) {
      this.context.logger.warn(EOL + userErrors[0].message + EOL);
      const errorCode = userErrors[0].code;
      let bypass = errorCode && this.context.ignoreErrors.includes(errorCode);

      if (errorCode) {
        if (bypass) {
          this.context.logger.warn(`Running with '--ignore-error ${userErrors[0].code}'. By-passing...` + EOL);
        } else {
          this.context.logger.warn(`Run the command again with '--ignore-error ${userErrors[0].code}' to by-pass this error.` + EOL);
        }
      }

      bypass = bypass || (await yesNoQuestion('Continue anyway?', {
        initial: false
      }));

      if (bypass) {
        return this.createBuild(_objectSpread(_objectSpread({}, createBuildParams), {}, {
          bypassUserErrors: true
        }));
      }
    }

    this._onErrors(userErrors);

    return {
      build,
      s3SelfSignedProjectPost: JSON.parse(s3SelfSignedProjectPost),
      deprecationWarning,
      environmentVariables: build.environmentVersion.environmentVariables.nodes
    };
  }

  async getBuild(buildId) {
    const res = await this._postGraphqlQuery(GET_BUILD_QUERY, {
      variables: {
        buildId
      },
      maxRetries: 2
    });
    return res.data.build;
  }

  async updateBuild(buildId, {
    status,
    routerInfo
  }, addToLogs = null) {
    const res = await this._postGraphqlQuery(UPDATE_BUILD_QUERY, {
      variables: {
        build: {
          id: buildId,
          status: status,
          routerInfo: routerInfo
        },
        addToLogs
      }
    });
    const {
      userErrors,
      build
    } = res.data.updateBuild;

    this._onErrors(userErrors);

    return build;
  } // This endpoint is not guaranteed to be supported by console-team. Do not expose functionality to the
  // customers without previous consultation with console-team. APPOPS-15456


  async createEnvironment({
    siteId,
    name,
    production = false,
    canMembersDeploy = false,
    copyEnvironment = null
  }) {
    const result = await this._postGraphqlQuery(ADD_ENVIRONMENT, {
      variables: {
        copyEnvironment: copyEnvironment,
        environment: {
          canMembersDeploy: canMembersDeploy,
          name: name,
          production: production,
          siteId: siteId
        }
      }
    });
    return result.data;
  } // This endpoint is not guaranteed to be supported by console-team. Do not expose functionality to the
  // customers without previous consultation with console-team. APPOPS-15456


  async deleteEnvironment(environmentId) {
    const result = await this._postGraphqlQuery(DELETE_ENVIRONMENT, {
      variables: {
        id: environmentId
      }
    });
    return result.data;
  } // This endpoint is not guaranteed to be supported by console-team. Do not expose functionality to the
  // customers without previous consultation with console-team. APPOPS-15456


  async setProductionEnvironment(environmentId) {
    const result = await this._postGraphqlQuery(SET_PRODUCTION_ENVIRONMENT, {
      variables: {
        id: environmentId
      }
    });
    return result.data;
  }

  async getTeamsSitesEnvs() {
    const result = await this._postGraphqlQuery(GET_TEAMS_SITES_ENVIRONMENTS, {
      maxRetries: 2
    });
    return result.data.teams;
  }

  async getPersonalTeam() {
    const result = await this._postGraphqlQuery(PERSONAL_TEAM_QUERY, {
      maxRetries: 2
    });
    return get(result, 'data.currentUser.personalTeam');
  }
  /**
   * Purges project cache
   *
   * @param {object} options
   * @param {string} options.siteSlug Slug of the Site to deploy to
   * @param {string} options.teamSlug Team where the Site belongs to. (default: personal team)
   * @param {string} options.environmentName The name of the environment to clear.
   * @param {string} options.path Path pattern to look for when purging the cache
   * @param {string} options.surrogateKey Surrogate key to look for when purging the cache
   */


  async purgeCache({
    teamSlug,
    siteSlug,
    path,
    surrogateKey,
    environmentName
  }) {
    let key;
    let values;

    if (path) {
      key = PURGE_BY_PATH;
      values = path;
    } else if (surrogateKey) {
      key = PURGE_BY_SURROGATE_KEY;
      values = surrogateKey;
    } else {
      key = PURGE_ALL_ENTRIES;
      values = [];
    } // it should always be an array


    if (typeof values === 'string') {
      values = [values];
    }

    const res = await this._postGraphqlQuery(PURGE_CACHE_QUERY, {
      variables: {
        teamSlug: teamSlug,
        siteSlug: siteSlug,
        purgeBy: key,
        environmentName: environmentName,
        values: values
      }
    });
    const {
      success,
      userErrors,
      purgeId
    } = res.data.purgeCache;

    this._onErrors(userErrors); // remove "&& false" to re-enable cache purge tracking:
    // eslint-disable-next-line no-constant-condition


    if (purgeId && false) {
      const progressBar = new cliProgress.SingleBar({
        format: '\u001b[32m{bar}\u001b[0m {percentage}%',
        hideCursor: true
      }, cliProgress.Presets.shades_classic);
      progressBar.start(100, 0);

      const updateProgress = async () => {
        const statusRes = await this._postGraphqlQuery(PURGE_CACHE_STATUS_QUERY, {
          variables: {
            cachePurgeId: purgeId
          }
        });
        const {
          progressPct
        } = statusRes.data.edgeCachePurge;
        progressBar.update(progressPct);

        if (progressPct < 100) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await updateProgress();
        }

        progressBar.stop();
        return Promise.resolve();
      };

      await updateProgress();
    }

    return success;
  }

  async presignedUploadToS3(s3PresignedPost, file) {
    const form = new FormData();
    forEach(s3PresignedPost.fields, (value, key) => {
      form.append(key, value);
    });
    form.append('file', file);
    const contentLength = await util.promisify(form.getLength).bind(form)();
    this.context.logger.verbose(`POST file to ${s3PresignedPost.url}/${s3PresignedPost.fields.key}`);

    try {
      const res = await axios.post(s3PresignedPost.url, form, {
        // This line fixes: https://github.com/axios/axios/issues/1362#issuecomment-403002283
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: _objectSpread({
          'Content-Length': contentLength
        }, form.getHeaders())
      });
      this.context.logger.verbose(`Response ${res.status}`);
      return res;
    } catch (e) {
      let responseDetails = e.message;

      if (e.response) {
        responseDetails = `${e.response.status} - ${JSON.stringify(e.response.data)}`;
      }

      throw new LeDeployerApiError('Something went wrong while uploading your package.\nPlease try again later and contact support if the problem persists', {
        errorDetails: `Unexpected error from file storage: ${responseDetails}`
      });
    }
  }

  async getEnvironmentVariables({
    siteSlug,
    teamSlug,
    environment
  }) {
    const result = await this._postGraphqlQuery(GET_ENVIRONMENT_VARIABLES, {
      variables: {
        siteSlug,
        teamSlug,
        environment
      },
      maxRetries: 2
    });
    return result.data.environment.environmentVariables.nodes;
  }

}

module.exports = Api;