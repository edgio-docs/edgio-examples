export const relativizeURL = (str) =>
  str.replace(
    'https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/',
    '/edgio-opt?quality=30&img=https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/'
  )

export const getOrigin = (req) => {
  let origin
  if (typeof window !== 'undefined') {
    origin = window.location.origin
  } else if (req) {
    console.log('req', req.headers)
    let hostURL = req.headers['x-host'] ?? req.headers['host']
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
