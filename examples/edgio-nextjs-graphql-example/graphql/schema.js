import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Category {
    category: String
    categoryName: String
    href: String
    items: [Product]
  }

  type Product {
    id: String
    description: String
    href: String
    name: String
    picture: String
    price: String
    rating: Float
    reviews: Int
  }

  type Query {
    categories: [Category]!
  }

  type Query {
    productsOfCategory(name: String!): [Product]
  }

  type Query {
    product(id: String!): Product
  }
`
