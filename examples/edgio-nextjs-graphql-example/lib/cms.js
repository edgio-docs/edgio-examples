import fetch from 'node-fetch'

const origin = 'https://edgio-docs-edgio-examples-api-default.edgio.link'
let apiUrl

if (typeof window !== 'undefined') {
  apiUrl = location.protocol + '//' + location.host + '/api'
} else {
  apiUrl = origin
}

export function getOptimizedImageUrl(path) {
  return apiUrl + path
}

/**
 * Gets all categories
 *
 * @return {Array}
 */
export async function getCategories() {
  const ret = { categories: [] }

  const res = await fetch(`${apiUrl}/category`).catch((e) => ({
    error: e.message,
  }))
  ret.categories = await res.json()

  return ret
}

/**
 * Gets a category by ID
 * @param {String} categoryId
 *
 * @return {Object}
 */
export async function getCategory(categoryName) {
  const ret = { name: categoryName, products: [] }

  const res = await fetch(`${apiUrl}/category/${categoryName}`).catch(
    (e) => (ret.error = e.message)
  )

  ret.products = await res.json()
  ret.products.forEach((item) => (item.picture = getOptimizedImageUrl(item.picture)))

  return ret
}

/**
 * Gets a product by ID
 * @param {String} productId
 *
 * @return {Object}
 */
export async function getProductById(productId) {
  const ret = { product: {} }

  const res = await fetch(`${apiUrl}/product/${productId}`).catch((e) => (ret.error = e.message))

  ret.product = await res.json()
  ret.product.picture = getOptimizedImageUrl(ret.product.picture)

  return ret
}
