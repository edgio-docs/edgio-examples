'use strict'; // We need to set version from package.json

const imageOptVersion = '1.27.0';

const _ = require('lodash');

const {
  get
} = require('lodash');

const fetch = require('node-fetch');

const normalizeUrl = require('normalize-url');

const url = require('url');

const sharp = require('sharp');

const setSize = require('./setSize');

const setQuality = require('./setQuality');

const getContentType = require('./getContentType');

const httpStatusCode = require('./http-status-code');

const constants = require('./constants');

const MIN_CACHE_TIME_SECONDS = '3600'; // set min image cache time to 1 hour

const STALE_AND_ERROR_CACHE_HEADERS = 'stale-while-revalidate=86400, stale-if-error=86400'; // 86400 = 1 day

const FETCH_TIMEOUT_MS = 10 * 1000; // this value is 10s and must be less than the Fastly TTFB timeout which is 60s.

const AWS_LAMBDA_RESPONSE_LIMIT_BYTES = 6 * 1024 * 1024;
/**
 * Returns true if the request has x-xdn-protocol header.
 *
 * We can check for x-xdn-protocol header because image optimizer lambda is invoked by XBP which always
 * injects the protocol header. If XBP injected x-xdn-protocol then it has determined that the request
 * is the old XDN request.
 *
 * @param {Object} headers Request headers
 * @returns {Boolean}
 */

const isOldXdnRequest = headers => {
  return !_.isEmpty(headers && headers['x-xdn-protocol']);
};
/**
 * processOptimizeRequest accepts an HTTP request, parses the query parameters
 * fetches the image and optimizes the image for smaller screen sizes.
 *
 * Accepts the following query parameters:
 *   `url` - The URL of the source image.  PNG and JPEG are supported.
 *   `h` - The height to reduce the image to
 *   `w` - The width to reduce the image to
 *   `q` - A number from 1 to 100 to reduce the quality (and therefore size) of the image.
 *   `u` - Do nothing
 *
 * Function Args:
 *   `event` is the http request object from AWS Lambda
 *
 * Returns:
 *   AWS Lambda response object
 *   no exceptions thrown
 *
 */


const processOptimizeRequest = async function (event) {
  let parameters = {};

  try {
    parameters = parseRequest(event);
    validateParameters(parameters);
    parameters.startTimeMs = new Date().getTime();
    await fetchImage(parameters);
    parameters.fetchTimeMs = new Date().getTime() - parameters.startTimeMs;
    parameters.startTimeMs = new Date().getTime();
    await optimizeImage(parameters);
    parameters.optimizeTimeMs = new Date().getTime() - parameters.startTimeMs;
    parameters.returnHttpStatusCode = httpStatusCode.OK;
  } catch (e) {
    if (e.type === 'request-timeout') {
      // On timeout exceptions, respond with Moovweb's standard 531, and record the zf= time
      // so it is easy for the customer to see what our timeout length is set to.
      e.statusCode = httpStatusCode.UpstreamTimeout;
      e.message = httpStatusCode.getMessage(httpStatusCode.UpstreamTimeout);
      parameters.fetchTimeMs = new Date().getTime() - parameters.startTimeMs;
    }

    parameters.exception = e;
    parameters.returnHttpStatusCode = e.statusCode || httpStatusCode.InternalServerError;
  }

  return getResponseObject(parameters);
};
/*
 * Pull the required values from the event URL and headers
 *
 * Returns:
 *  dictionary of values
 *    (strings, except for img, are forced to lower case.
 *
 *   no exceptions thrown
 */


const parseRequest = function (event) {
  let parameters = {
    // For easier validation, make strings case insensitive.
    accept: get(event.headers, 'accept', '*/*').toLowerCase(),
    origin: get(event.headers, 'origin', undefined),
    host: get(event.headers, 'host', undefined),
    protocol: get(event.headers, 'x-0-protocol', get(event.headers, 'x-xdn-protocol', 'https')),
    img: event.multiValueQueryStringParameters.url,
    quality: event.multiValueQueryStringParameters.q,
    height: event.multiValueQueryStringParameters.h,
    width: event.multiValueQueryStringParameters.w,
    unoptimized: event.multiValueQueryStringParameters.u !== undefined,
    originalUrl: event.path,
    ip: get(event.headers, 'x-forwarded-for', ''),
    isOldXdnRequest: isOldXdnRequest(event.headers)
  };
  logger.debug(parameters, 'parseRequest returns');
  return parameters;
};
/*
 * Validate the parameters and update the parameters per our optimization rules.
 *
 * Returns:
 *   no return value
 *   update the parameters dictionary
 *
 *   Exceptions thrown on invalid parameters
 */


const validateParameters = function (parameters) {
  if (!parameters.img) {
    throw new Error('The "url" query parameter is required.');
  } // Ensure the ustream URL always has protocol://hostname using values received from the xdn-buffer-proxy.


  const u = new URL(parameters.img, `${parameters.protocol}://${parameters.host}`);
  parameters.img = url.format(u); // stripWWW: false because we need to keep the original host name.
  // sortQueryParameters: false because it breaks query parameters that have $ in them

  parameters.img = normalizeUrl(parameters.img, {
    stripWWW: false,
    sortQueryParameters: false
  });

  if (parameters.quality != null) {
    parameters.quality = Number(parameters.quality);

    if (isNaN(parameters.quality)) {
      throw new Error(`Invalid quality value '${parameters.quality}'`);
    }

    if (parameters.quality < 1 || parameters.quality > 100) {
      throw new Error(`Quality must be between 1 and 100 not '${parameters.quality}'`);
    }
  } else {
    parameters.quality = 75; // The default value
  }

  if (parameters.height != null) {
    parameters.height = Number(parameters.height);

    if (isNaN(parameters.height)) {
      throw new Error(`Invalid height value '${parameters.height}'`);
    }
  }

  if (parameters.width != null) {
    parameters.width = Number(parameters.width);

    if (isNaN(parameters.width)) {
      throw new Error(`Invalid width value '${parameters.width}'`);
    }
  } // Default to the most widely supported format: jpeg


  parameters.isWebpSupported = false;
  parameters.fmt = constants.formatJpeg; // If the "Accept" header exists, use that. Prefer image fmts in this order: webp, png, jgp

  if (parameters.accept) {
    if (parameters.accept.indexOf('webp') >= 0) {
      parameters.isWebpSupported = true;
      parameters.fmt = constants.formatWebp;
    } else if (parameters.accept.indexOf('png') >= 0) {
      parameters.isWebpSupported = false;
      parameters.fmt = constants.formatPng;
    } // else jpeg

  }

  logger.debug(parameters, 'validateParameters returns');
};
/*
 * Inject the cache-control header based on the upstream response.
 * Use MIN_CACHE_TIME_SECONDS as the minimum cache time regardless of upstream response.
 *
 * Returns:
 *   no value returned, sets the following
 *   parameters.cacheControl = the cache-control header returned by the upstream fetch
 *
 */


const injectCacheControlHeader = function (response, parameters) {
  let cacheTimeSeconds = MIN_CACHE_TIME_SECONDS;
  const cacheControl = response.headers.get('cache-control');

  if (cacheControl) {
    // parse out the possible values from the cacheControl header
    const maxAge = cacheControl.match(/max-age=(\d+)/);

    if (maxAge) {
      cacheTimeSeconds = Math.max(cacheTimeSeconds, maxAge[1]);
    } else {
      const sMaxAge = cacheControl.match(/s-maxage=(\d+)/);

      if (sMaxAge) {
        cacheTimeSeconds = Math.max(cacheTimeSeconds, sMaxAge[1]);
      }
    }
  }

  parameters.cacheControl = `max-age=${cacheTimeSeconds}, ${STALE_AND_ERROR_CACHE_HEADERS}`;
};
/*
 * Fetch the image from the upstream
 *
 * Returns:
 *   no value returned, sets the following
 *   parameters.buffer - the raw NodeJS buffer of the fetched upstream image
 *   parameters.upstreamContentType - the content-type header returned by the upstream fetch
 *   parameters.cacheControl = the cache-control header to return
 *
 *   Exceptions thrown on non 200-OK response from upstream.
 */


const fetchImage = async function (parameters) {
  // fetch the source image
  parameters.buffer = await fetch(parameters.img, {
    timeout: FETCH_TIMEOUT_MS
  }).then(fetchResponse => {
    parameters.upstreamContentType = fetchResponse.headers.get('content-type');
    parameters.upstreamHttpStatusCode = fetchResponse.status;
    injectCacheControlHeader(fetchResponse, parameters);

    if (fetchResponse.status !== httpStatusCode.OK) {
      const e = new Error(`Error ${fetchResponse.status} from upstream.`);
      e.statusCode = fetchResponse.status;
      logger.debug(parameters, 'fetchImage exception');
      throw e;
    }

    return fetchResponse.buffer();
  });
  logger.debug({
    upstreamHttpStatusCode: parameters.upstreamHttpStatusCode
  }, 'fetchImage returns');
};
/*
 * Perform the actual image optimization
 *
 * Returns:
 *   sets parameters.imageBuffer to the optimized image
 *   sets parameters.returnedContentType to the content-type of the optimized image
 *
 *   no exceptions thrown
 */


const optimizeImage = async function (parameters) {
  // If the unoptimized flag is set, just return the orignal image as is.
  if (parameters.unoptimized) {
    parameters.returnedContentType = parameters.upstreamContentType;
    parameters.imageBuffer = parameters.buffer;
    parameters.responseBuffer = parameters.imageBuffer.toString('base64');
    parameters.iSize = parameters.buffer.length;
    parameters.oSize = parameters.iSize;
    return;
  }

  parameters.returnedContentType = getContentType(parameters.fmt, parameters.upstreamContentType);
  parameters.imageBuffer = sharp(parameters.buffer); // If format is Jpeg and there is a transparency layer in the original, use webp or png because jpeg does not support transparency.

  const metadata = await parameters.imageBuffer.metadata();
  parameters.hasAlpha = metadata.hasAlpha;

  if (parameters.hasAlpha && parameters.returnedContentType === constants.contentTypeJpeg) {
    if (parameters.isWebpSupported) {
      parameters.returnedContentType = constants.contentTypeWebp;
    } else {
      parameters.returnedContentType = constants.contentTypePng;
    }
  }

  setSize({
    image: parameters.imageBuffer,
    height: parameters.height,
    width: parameters.width
  });
  setQuality({
    image: parameters.imageBuffer,
    quality: parameters.quality,
    contentType: parameters.returnedContentType
  });
  parameters.iSize = parameters.buffer.length;
  parameters.responseBuffer = (await parameters.imageBuffer.toBuffer()).toString('base64');
  parameters.oSize = parameters.responseBuffer.length;
};
/*
 * Return response Obejct to the Lambda Event.
 * If there was an exception during processing then we respond
 * with the exception string instead of an image
 *
 * Include the logging needed by OPs to debug this application
 *
 * Returns:
 *   no return value
 *   no exceptions
 */


const getResponseObject = function (parameters) {
  // Amazon Lambdas have a response size limit https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  // If we exceed that limit, we return the XDN 531 - Layer0 Project Response Too Large error
  if (parameters.oSize >= AWS_LAMBDA_RESPONSE_LIMIT_BYTES) {
    parameters.returnHttpStatusCode = httpStatusCode.ResponseTooLarge;
    parameters.exception = {
      message: httpStatusCode.getMessage(httpStatusCode.ResponseTooLarge)
    };
  }

  const responseObject = {
    statusCode: parameters.returnHttpStatusCode,
    multiValueHeaders: buildResponseHeaders(parameters)
  }; // Normally log to logger.info() - But if there is an exception, use logger.error()
  // to ensure the error details are sent to the logging subsystem.

  let pfnLogger = logger.info.bind(logger);

  if (parameters.exception) {
    pfnLogger = logger.error.bind(logger);
    responseObject.body = parameters.exception.message;
  } else {
    responseObject.body = parameters.responseBuffer;
    responseObject.isBase64Encoded = true;
  } // Log one info line in SumoLogic per image optimizer request


  pfnLogger({
    url: parameters.originalUrl,
    ip: parameters.ip,
    code: parameters.returnHttpStatusCode,
    contentType: parameters.returnedContentType,
    fmt: parameters.fmt,
    iSize: parameters.iSize,
    oSize: parameters.oSize,
    height: parameters.height,
    width: parameters.width,
    quality: parameters.quality,
    xmt: responseObject.multiValueHeaders['x-0-t'] || responseObject.multiValueHeaders['x-xdn-t']
  }, parameters.exception ? `error=${parameters.exception.message}` : 'success');
  return responseObject;
};
/*
 * Returns the response headers for the processed request
 *
 * Returns:
 *   return responseHeaders
 *   no exceptions
 */


const buildResponseHeaders = function (parameters) {
  let x0tValue = '';
  let totalTimeMs = 0;

  if (!isNaN(parameters.optimizeTimeMs)) {
    x0tValue = `,wz=${parameters.optimizeTimeMs}`;
    totalTimeMs += parameters.optimizeTimeMs;
  }

  if (!isNaN(parameters.fetchTimeMs)) {
    x0tValue = `,wp=${parameters.fetchTimeMs}${x0tValue}`;
    totalTimeMs += parameters.fetchTimeMs;
  }

  x0tValue = `wt=${totalTimeMs}${x0tValue}`;
  const x0Components = parameters.isOldXdnRequest ? 'x-xdn-components' : 'x-0-components';
  const x0Status = parameters.isOldXdnRequest ? 'x-xdn-status' : 'x-0-status';
  const x0t = parameters.isOldXdnRequest ? 'x-xdn-t' : 'x-0-t';
  const x0image = parameters.isOldXdnRequest ? 'x-xdn-image' : 'x-0-image'; // These base headers are returned on both success and failure
  // Even though our Fastly does not cache code > 302 today,
  // long term we should cache errors like 404 for 15 minutes
  // to reduce pressure on the Moovweb servers.

  const responseHeaders = {
    [x0Components]: `i=${imageOptVersion}`,
    [x0Status]: `i=${parameters.returnHttpStatusCode}`,
    [x0t]: x0tValue
  }; // Report on the actual parameters we used to create this image

  responseHeaders[x0image] = `i=${parameters.img}` + `${parameters.fmt ? ',f=' + parameters.fmt : ''}` + `${parameters.height ? ',h=' + parameters.height : ''}` + `${parameters.width ? ',w=' + parameters.width : ''}` + `${parameters.quality ? ',q=' + parameters.quality : ''}` + `${parameters.iSize ? ',i=' + parameters.iSize : ''}` + `${parameters.oSize ? ',o=' + parameters.oSize : ''}`; // If we went upstream, include that status code in the reponse headers

  if (parameters.upstreamHttpStatusCode) {
    responseHeaders[x0Status] = `${responseHeaders[x0Status]},iu=${parameters.upstreamHttpStatusCode}`;
  } // On success only, inject the caching headers, CORs headers and appropriate content type


  if (parameters.returnHttpStatusCode >= httpStatusCode.OK && parameters.returnHttpStatusCode < httpStatusCode.BadRequest) {
    responseHeaders['Cache-Control'] = parameters.cacheControl;
    responseHeaders['Content-Type'] = parameters.returnedContentType;
    responseHeaders['Access-Control-Allow-Methods'] = 'GET,POST,HEAD';
    responseHeaders['Access-Control-Allow-Origin'] = parameters.origin || '*';
    responseHeaders['Access-Control-Max-Age'] = '3000';
  } else {
    // on error we send the error text, so set the content-type to text/plain
    responseHeaders['Content-Type'] = constants.contentTypeText;
  }

  return responseHeaders;
};

module.exports = {
  parseRequest: parseRequest,
  validateParameters: validateParameters,
  fetchImage: fetchImage,
  optimizeImage: optimizeImage,
  processOptimizeRequest: processOptimizeRequest,
  buildResponseHeaders: buildResponseHeaders,
  injectCacheControlHeader: injectCacheControlHeader,
  getResponseObject: getResponseObject
};