import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar DateTime
  scalar Upload
  scalar Test
  type Query {
    books(collection: Collection): [Book]

    # User
    getMe: GetAuthUserResponse!
    getBook(slug: String!): Book
  }

  type Mutation {
    # Auth
    loginUser(input: LoginInput!): LoginResponse!
    signupUser(input: SignUpInput!): UserResponse!
    addBook(input: BookInput!): BookResponse!
    updateBook(slug: String!, input: BookInputUpdate!): BookResponse!
    finishBook(id: String!, rating: Int!): BookResponse
    logoutUser: Boolean!
    sendMessage(name: String, content: String): Message!
  }

  type Subscription {
    bookFinished: BookFinished!
    receiveMessage: Message!
  }

  type Message {
    id: ID!
    name: String!
    content: String
  }

  type Book {
    id: ID!
    title: String!
    slug: String!
    author: String!
    date: String!
    coverImage: String
    collectionSection: Collection!
  }

  type User {
    id: ID!
    name: String!
  }

  enum Collection {
    WANT_TO_READ
    READING
    READ
  }

  type BookFinished {
    book: Book
    user: User
    rating: Int
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input BookInput {
    title: String!
    author: String!
    date: String!
    collectionSection: Collection!
    coverImage: Upload!
  }

  input BookInputUpdate {
    title: String
    author: String
    date: String
    collectionSection: Collection
    coverImage: Upload
  }

  type LoginResponse {
    status: Boolean!
    access_token: String!
    user: UserData!
  }

  type GetAuthUserResponse {
    status: Boolean!
    user: UserData!
  }

  type UserResponse {
    status: Boolean!
    user: UserData!
  }

  type BookResponse {
    status: Boolean!
    book: BookData!
  }

  type UserData {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime
    updatedAt: DateTime
    books(collection: Collection): [Book]
  }

  type BookData {
    id: ID!
    title: String!
    author: String!
    date: String!
    collectionSection: Collection!
    coverImage: String!
    created_by: UserData!
    createdAt: DateTime
    updatedAt: DateTime
  }
`
