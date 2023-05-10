import checkIsLoggedIn from '../middleware/checkIfLoggedIn.ts'
import errorHandler from './error.controller.ts'

import { BookModel } from '../models/book.model.ts'
import { uploadImage } from '../../services/cloudinary.ts'
import slugify from 'slugify'
import { BOOK_FINISHED } from '../../constants.ts'
import pubsub from '../../graphql/subscription.ts'

const createNewBook = async (
  parent: any,
  { input: { title, author, date, collectionSection, coverImage } }: any,
  { req, getAuthUser }: { req: any; getAuthUser: any }
): Promise<any> => {
  try {
    const loggedInUser = await checkIsLoggedIn(req, getAuthUser)

    const imageUrl = await uploadImage(coverImage)

    const book = await BookModel.create({
      title,
      author,
      date,
      collectionSection,
      coverImage: imageUrl,
      created_by: loggedInUser.id,
      slug: slugify(title, { lower: true })
    })

    return {
      status: true,
      book
    }
  } catch (error) {
    errorHandler(error)
  }
}

const getBook = async (
  parent: any,
  { slug }: any,
  { req, res, getAuthUser }: { req: Request; res: Response; getAuthUser: any }
): Promise<any> => {
  try {
    await checkIsLoggedIn(req, getAuthUser)

    const book = await BookModel.findOne({ slug })

    return book
  } catch (error) {
    errorHandler(error)
  }
}

const updateBook = async (
  parent: any,
  { slug, input: { title, author, date, collectionSection, coverImage } }: any,
  { req, res, getAuthUser }: { req: Request; res: Response; getAuthUser: any }
): Promise<any> => {
  try {
    await checkIsLoggedIn(req, getAuthUser)
    const book = await BookModel.findOneAndUpdate(
      { slug },
      {
        title,
        slug: slugify(title, { lower: true }),
        author,
        date,
        collectionSection,
        coverImage
      },
      { new: true }
    )

    if (!book) {
      throw new Error('Book not found')
    }

    return {
      status: true,
      book
    }
  } catch (error) {
    errorHandler(error)
  }
}

const finishBook = async (
  parent: any,
  { id }: any,
  { req, res, getAuthUser }: { req: Request; res: Response; getAuthUser: any }
): Promise<any> => {
  try {
    const loggedInUser = await checkIsLoggedIn(req, getAuthUser)

    const book = await BookModel.findByIdAndUpdate(
      id,
      {
        collectionSection: 'READ',
        rating: 5
      },
      { new: true }
    )

    pubsub.publish(BOOK_FINISHED, {
      bookFinished: { book, user: loggedInUser, rating: 5 }
    })

    pubsub.publish('MessageService', { receiveMessage: 'TEST' })

    return {
      status: true,
      book
    }
  } catch (error) {
    errorHandler(error)
  }
}
export default {
  createNewBook,
  updateBook,
  getBook,
  finishBook
}
