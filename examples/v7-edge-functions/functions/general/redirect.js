function getQueryParam(url, paramName) {
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get(paramName);
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
