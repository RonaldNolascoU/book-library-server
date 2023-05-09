import userController from '../../src/controllers/user.controller'
import authController from '../../src/controllers/auth.controller'
import DateTimeScalar from './datetime'
import bookController from '../../src/controllers/book.controller'
import { GraphQLUpload } from 'graphql-upload'
import { BOOK_FINISHED } from '../../constants'
import { withFilter } from 'graphql-subscriptions'
import pubsub from '../subscription'

enum Collection {
  WANT_TO_READ = 'WANT_TO_READ',
  READING = 'READING',
  READ = 'READ'
}

interface User {
  id: string
  name: string
}
interface Book {
  id: string
  title: string
  author: string
  date: string
  coverImage?: string
  collectionSection: Collection
}

let books: Book[] = []
let messages: any = []

export const resolvers = {
  Upload: GraphQLUpload,
  DateTime: DateTimeScalar,
  Query: {
    getMe: userController.getMe,
    getBook: bookController.getBook
  },
  Mutation: {
    // Auth
    signupUser: authController.signup,
    loginUser: authController.login,
    logoutUser: authController.logoutHandler,
    addBook: bookController.createNewBook,
    updateBook: bookController.updateBook,
    finishBook: bookController.finishBook,
    sendMessage: (parent, { name, content }) => {
      const id = messages.length
      var new_message = {
        id,
        name,
        content
      }
      messages.push(new_message)
      pubsub.publish('MessageService', { receiveMessage: new_message })
      return new_message
    }
  },
  Subscription: {
    bookFinished: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([BOOK_FINISHED]),
        (payload, variables) => {
          return true
        }
      )
    },
    receiveMessage: {
      subscribe: () => pubsub.asyncIterator(['MessageService'])
    }
  }
}
