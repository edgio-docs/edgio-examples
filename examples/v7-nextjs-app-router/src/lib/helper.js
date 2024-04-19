export const getOrigin = (headers) => {
  let origin;
  if (typeof window !== 'undefined') {
    origin = window.location.origin;
  } else if (headers) {
    const referer = headers.get('referer');
    const host = headers.get('host');
    const xHost = headers.get('x-host');

    let hostURL;

    if (referer) {
      hostURL = new URL(referer).host;
    } else {
      hostURL = host || xHost;
    }

    if (hostURL) {
      hostURL = hostURL.replace('http://', '').replace('https://', '');
      if (hostURL.includes('localhost:') || hostURL.includes('127.0.0.1')) {
        origin = `http://${hostURL}`;
      } else {
        origin = `https://${hostURL}`;
      }
    }
  }
  return origin;
};

export const filterProducts = (data, filter) => {
  let temp = data;
  if (!temp || !(temp instanceof Array)) {
    return new Array(12).fill(0).map((_, _ind) => ({
      name: '',
      slug: '',
      path: `/${_ind}`,
      prices: { price: { value: '', currencyCode: '' } },
    }));
  }
  if (filter) {
    if (filter === 'trending') {
      temp.sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
    } else if (filter === 'price-low-to-high') {
      temp.sort((a, b) => (a.price.value > b.price.value ? 1 : -1));
    } else if (filter === 'price-high-to-low') {
      temp.sort((a, b) => (a.price.value > b.price.value ? -1 : 1));
    }
  }
  return temp;
};
