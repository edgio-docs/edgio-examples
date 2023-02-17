export const relativizeURL = (str) =>
  str.replace(
    'https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/',
    '/l0-opt?quality=30&img=https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/'
  )

export const filterProducts = (data, filter) => {
  let temp = [...data]
  if (!temp) return temp
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
