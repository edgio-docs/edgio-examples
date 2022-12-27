import { gql } from '@apollo/client'

export const CATEGORIES = gql`
  query GetCategories {
    categories {
      category
      categoryName
      href
    }
  }
`

export const PRODUCTS_BY_CATEGORY = gql`
  query GetProductsOfCategory($name: String!) {
    productsOfCategory(name: $name) {
      description
      href
      name
      picture
      price
      rating
    }
  }
`

export const PRODUCT = gql`
  query GetProduct($productId: String!) {
    product(id: $productId) {
      id
      description
      href
      name
      picture
      price
      rating
      reviews
    }
  }
`
