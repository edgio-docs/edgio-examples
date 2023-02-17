const { join } = require('path')
const fetch = (...args) => import(`node-fetch`).then(({ default: fetch }) => fetch(...args))

const apiUrl = 'https://edgio-community-ecommerce-api-example-default.layer0-limelight.link'

exports.initPages = async function () {
  let resp = await fetch(`${apiUrl}/categories/all`)
  if (resp.ok) {
    let data = await resp.json()
    data.forEach((i) => {
      // Create commerce(s) pages from the data
      this.pages.createPage({
        assets: {},
        internal: {
          id: Math.random().toString(),
          relative: 'commerce.vue',
          absolute: join(process.cwd(), 'pages', 'commerce.vue'),
          isFile: true,
          saved: false,
        },
        type: 'page',
        slug: i.slug,
        contentType: 'vue',
        permalink: `/commerce/${i.slug}.html`,
        component: './pages/commerce.vue',
      })
    })
  }
  resp = await fetch(`${apiUrl}/products/all`)
  if (resp.ok) {
    let data = await resp.json()
    data.forEach((i) => {
      // Create product(s) pages from the data
      this.pages.createPage({
        assets: {},
        internal: {
          id: Math.random().toString(),
          relative: 'product.vue',
          absolute: join(process.cwd(), 'pages', 'product.vue'),
          isFile: true,
          saved: false,
        },
        type: 'page',
        slug: i.slug,
        contentType: 'vue',
        permalink: `/product/${i.slug}.html`,
        component: './pages/product.vue',
      })
    })
  }
}
