import '../../utils/polyfills/URL';

function getQueryParam(url, param) {
  const queryParams = {};
  const queryString = url.query[0] === '?' ? url.query.substr(1) : url.query;
  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    queryParams[key] = decodeURIComponent(value);
  });
  return queryParams[param];
}

export async function handleHttpRequest(request, context) {
  const url = new URL(request.url);
  let redirectPath = '';

  if (url.pathname === '/example/redirects/first') {
    redirectPath = '/first-path';
  } else if (getQueryParam(url, 'queryRedirect')) {
    const queryValue = getQueryParam(url, 'queryRedirect');
    redirectPath = `/query-${queryValue}`;
  } else {
    redirectPath = '/no-redirect-match';
  }

  const redirectUrl = `${url.protocol}//${url.host}${redirectPath}`;
  return Response.redirect(redirectUrl, 301);
}
