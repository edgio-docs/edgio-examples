export const relativizeURL = (str) =>
  str.replace(
    'https://edgio-docs-edgio-ecommmerce-api-example-default.edgio-limelight.link/',
    '/edgio-opt?quality=30&img=https://edgio-docs-edgio-ecommmerce-api-example-default.edgio-limelight.link/'
  )

export const getOrigin = (req) => {
  let origin
  if (typeof window !== 'undefined') {
    origin = window.location.origin
  } else {
    let hostURL = req ? req.headers['x-host'] ?? req.headers['host'] : process.env.API_URL
    if (hostURL) {
      hostURL = hostURL.replace('http://', '')
      hostURL = hostURL.replace('https://', '')
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
  let temp = [...data]
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
