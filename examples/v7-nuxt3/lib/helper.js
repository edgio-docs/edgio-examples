/**
 * Returns a relative URL from a given URL. This is used to remove the origin from the image URL
 * so that the image can be handled by Edgio router and processed by the image optimizer.
 */
export const relativizeURL = (str) => {
  if (!str) return ''
  // Only the path and query string appended to /edgio-image/.
  str = str.replace(/^(?:\/\/|[^/]+)*\//, '/edgio-image/')

  // Append `?auto=webp` to the URL to request WebP images while preserving any existing query string.
  if (str.includes('?')) {
    str += '&auto=webp'
  } else {
    str += '?auto=webp'
  }

  return str
}

export const getOrigin = (req) => {
  let origin
  if (typeof window !== 'undefined') {
    origin = window.location.origin
  } else if (req) {
    let hostURL = req.headers['host'] || process.env.API_URL
    if (hostURL) {
      hostURL = hostURL.replace('http://', '').replace('https://', '')
      if (hostURL.includes('localhost:') || hostURL.includes('127.0.0.1')) {
        origin = `http://${hostURL}`
      } else {
        origin = `https://${hostURL}`
      }
    }
  }
  return origin
}

export const filterProducts = (data, filter) => {
  let temp = data
  if (!temp || !(temp instanceof Array)) {
    return new Array(12).fill(0).map((_, _ind) => ({
      name: '',
      slug: '',
      path: `/${_ind}`,
      prices: { price: { value: '', currencyCode: '' } },
    }))
  }
  if (filter) {
    if (filter === 'trending') {
      temp.sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
    } else if (filter === 'price-low-to-high') {
      temp.sort((a, b) => (a.price.value > b.price.value ? 1 : -1))
    } else if (filter === 'price-high-to-low') {
      temp.sort((a, b) => (a.price.value > b.price.value ? -1 : 1))
    }
  }
  return temp
}
