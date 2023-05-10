import { uploadImage } from '../../services/cloudinary'
import bookController from '../controllers/book.controller'
import checkIsLoggedIn from '../middleware/checkIfLoggedIn'
import { BookModel } from '../models/book.model'

jest.mock('../middleware/checkIfLoggedIn')
jest.mock('../../services/cloudinary')
jest.mock('../models/book.model')

const mockCheckIsLoggedIn = checkIsLoggedIn as jest.MockedFunction<
  typeof checkIsLoggedIn
>
const mockUploadImage: any = uploadImage as jest.MockedFunction<
  typeof uploadImage
>

const mockedBookModelCreate: any = BookModel.create as jest.MockedFunction<
  typeof BookModel.create
>

describe('createNewBook', () => {
  beforeEach(() => {
    mockCheckIsLoggedIn.mockClear()
    mockUploadImage.mockClear()
    mockedBookModelCreate.mockClear()
  })

  it('should create a new book successfully', async () => {
    const input = {
      title: 'Test Book',
      author: 'Test Author',
      date: '2023-05-09',
      collectionSection: 'Test Section',
      coverImage: 'test-image'
    }
    const loggedInUser = { id: '1' }
    const imageUrl = 'uploaded-image-url'
    const createdBook = { ...input, created_by: loggedInUser.id }

    mockCheckIsLoggedIn.mockResolvedValue(loggedInUser)
    mockUploadImage.mockResolvedValue(imageUrl)
    mockedBookModelCreate.mockResolvedValue(createdBook)

    const result = await bookController.createNewBook(
      null,
      { input },
      { req: {}, getAuthUser: {} }
    )

    expect(result).toEqual({ status: true, book: createdBook })
    expect(checkIsLoggedIn).toHaveBeenCalled()
    expect(uploadImage).toHaveBeenCalledWith(input.coverImage)
  })

  it('should handle errors', async () => {
    const input = {
      title: 'Test Book',
      author: 'Test Author',
      date: '2023-05-09',
      collectionSection: 'Test Section',
      coverImage: 'test-image'
    }
    const error = new Error('Test error')

    mockCheckIsLoggedIn.mockRejectedValue(error)

    try {
      await bookController.createNewBook(
        null,
        { input },
        { req: {}, getAuthUser: {} }
      )
    } catch (err) {
      expect(err).toBe(error)
    }

    expect(checkIsLoggedIn).toHaveBeenCalled()
  })
})
