import * as cms from '../lib/cms'

export const resolvers = {
  Query: {
    categories: async () => {
      const { categories } = await cms.getCategories()
      return categories
    },

    productsOfCategory: async (_parent, args) => {
      const { products } = await cms.getCategory(args.name.toLowerCase())
      return products
    },

    product: async (_parent, args) => {
      const { product } = await cms.getProductById(args.id)
      product.id = product._id
      return product
    },
  },
}
