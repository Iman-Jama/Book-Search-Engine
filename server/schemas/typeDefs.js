const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
  }

  type Book {
    _id: ID
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    author: [String!]!
    description: String!
    title: String!
    bookId: String!
    image: String!
    link: String!
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    books: [Book]
    book(bookId: ID!): Book

  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    loginUser(email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: ID!): User
   
  }
`;

module.exports = typeDefs;
