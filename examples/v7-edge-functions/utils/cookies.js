/**
 * Parses cookies from a Web API Request object.
 *
 * @param {Request} req - The Web API Request object.
 * @returns {Object} An object containing key-value pairs of cookies.
 */
export function getCookiesFromRequest(req) {
  const rawCookies = req.headers.get('Cookie') || '';
  const parsedCookies = {};

  rawCookies.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=').map((str) => str.trim());
    parsedCookies[key] = value;
  });

  return parsedCookies;
}

/**
 * Sets one or multiple cookies to a Web API Response object.
 *
 * @param {Response} res - The Web API Response object.
 * @param {string|string[]|Object|Array} cookies - Single or multiple cookie strings, or an object or 2D array of key-value pairs.
 */
export function setCookieToResponse(res, cookies) {
  let cookieStrings = [];

  if (Array.isArray(cookies)) {
    if (Array.isArray(cookies[0])) {
      // Handle 2D array
      cookieStrings = cookies.map(([key, value]) => formatCookie(key, value));
    } else {
      // Handle string array
      cookieStrings = cookies;
    }
  } else if (typeof cookies === 'object') {
    // Handle object
    cookieStrings = Object.entries(cookies).map(([key, value]) =>
      formatCookie(key, value)
    );
  } else {
    // Handle single string
    cookieStrings = [cookies];
  }

  res.headers.append('Set-Cookie', cookieStrings.join('; '));
}

/**
 * Formats a cookie string from key-value pair.
 *
 * @param {string} key - The cookie key.
 * @param {string} value - The cookie value.
 * @returns {string} The formatted cookie string.
 */
function formatCookie(key, value) {
  return `${key}=${value}`;
}
