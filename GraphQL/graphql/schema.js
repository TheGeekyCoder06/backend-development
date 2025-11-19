// this file will tell what the schema is
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    category: String!
    price: Float!
    inStock: Boolean!
  }
  type Query {
      products: [Product!]!
      product(id: ID!): Product
  }

  type Mutation {
    addProduct(
    title: String!,
    category: String!,
    price: Float!,
    inStock: Boolean!
    ): Product

    deleteProduct(id: ID!): Boolean
    updateProduct(
      id: ID!,
      title: String,
      category: String,
      price: Float,
      inStock: Boolean
    ): Product
    }
`;
