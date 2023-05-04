// pages/api/graphql.ts
import { ApolloServer, gql } from 'apollo-server';

import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
  } from 'apollo-server-core';

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
  }
`;

interface Book {
  id: string;
  title: string;
  author: string;
}

const books: Book[] = [
  { id: '1', title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: '3', title: 'Pride and Prejudice', author: 'Jane Austen' },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

// Set up plugins based on the environment
const plugins =
  process.env.NODE_ENV === 'production'
    ? [ApolloServerPluginLandingPageProductionDefault({ embed: false })]
    : [ApolloServerPluginLandingPageLocalDefault({ embed: true })];

const server = new ApolloServer({ typeDefs, resolvers, plugins });

// Start the server
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });