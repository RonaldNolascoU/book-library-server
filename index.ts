import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { WebSocketServer } from 'ws'

import { ApolloServer } from 'apollo-server-express'

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from 'apollo-server-core'

import { typeDefs } from './graphql/schema'
import { resolvers } from './graphql/resolvers/'

import './services/mongo-connection'

import http from 'http'

import getAuthUser from './src/middleware/authUser.ts'
import connectDB from './services/mongo-connection'
import dotenv from 'dotenv'
import { graphqlUploadExpress } from 'graphql-upload'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'

dotenv.config()

const app = express()

app.use(express.static('public'))
app.use('/images', express.static('uploads'))

// MIDDLEWARE
app.use(cookieParser())

const httpServer = http.createServer(app)

const corsOptions = {
  origin: true,
  credentials: true
}

app.use(cors(corsOptions))

// Set up plugins based on the environment
const defaultPlugins = [ApolloServerPluginDrainHttpServer({ httpServer })]
const plugins =
  process.env.NODE_ENV === 'production'
    ? [ApolloServerPluginLandingPageProductionDefault({ embed: false })]
    : [ApolloServerPluginLandingPageLocalDefault({ embed: true })]

;(async function () {
  // Use the GraphQL WebSocket server
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql'
  })

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // csrfPrevention: true,
    plugins: [
      ...defaultPlugins,
      ...plugins,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ],
    context: async ({ req, res }) => ({ req, res, getAuthUser })
  })

  // CONNECT DB
  await connectDB()

  // START APOLLO SERVER
  await server.start()

  app.use(graphqlUploadExpress())

  server.applyMiddleware({ app, cors: corsOptions })

  await new Promise<void>((resolve) =>
    httpServer.listen(4000, '0.0.0.0', resolve)
  )
  console.log(`Server started at http://localhost:4000${server.graphqlPath}`)
  console.log(
    `Subscriptions are running at ws://localhost:4000${server.graphqlPath}`
  )
})()
