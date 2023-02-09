const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')
const fetch = (...args) => import(`node-fetch`).then(({ default: fetch }) => fetch(...args))

const apiUrl = 'https://edgio-community-ecommerce-api-example-default.layer0-limelight.link'

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === 'build-javascript') {
    actions.setWebpackConfig({
      plugins: [
        new InjectManifest({
          swSrc: './sw/service-worker.js',
        }),
      ],
    })
  }
}

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const commerceTemplate = path.resolve(`src/templates/commerce.js`)
  const productTemplate = path.resolve(`src/templates/product.js`)
  let resp = await fetch(`${apiUrl}/products/all`)
  if (resp.ok) {
    let data = await resp.json()
    createPage({
      path: '/commerce',
      component: commerceTemplate,
      context: data,
    })
    data.forEach((i) => {
      createPage({
        path: `/product/${i.slug}`,
        component: productTemplate,
        context: [i],
      })
    })
  }
  resp = await fetch(`${apiUrl}/categories/all`)
  if (resp.ok) {
    let data = await resp.json()
    for (let i = 0; i < data.length; i++) {
      resp = await fetch(`${apiUrl}/categories/${data[i].slug}`)
      let pageData = (await resp.json())['items']
      createPage({
        path: `/commerce/${data[i].slug}`,
        component: commerceTemplate,
        context: pageData,
      })
    }
  }
}
