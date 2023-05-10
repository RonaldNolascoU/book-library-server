import authController from '../controllers/auth.controller'
import errorHandler from '../controllers/error.controller'
import checkIsLoggedIn from '../middleware/checkIfLoggedIn'

jest.mock('../middleware/checkIfLoggedIn')
jest.mock('../controllers/error.controller')

const mockCheckIsLoggedIn = checkIsLoggedIn as jest.MockedFunction<
  typeof checkIsLoggedIn
>
const mockErrorHandler: any = errorHandler as jest.MockedFunction<
  typeof errorHandler
>

describe('logoutHandler', () => {
  it('should log out the user and clear cookies', async () => {
    const req = {}
    const res = {
      cookie: jest.fn()
    }
    const getAuthUser = jest.fn()

    mockCheckIsLoggedIn.mockResolvedValue(true)
    mockErrorHandler.mockImplementation(() => {})

    const result = await authController.logoutHandler(null, null, {
      req,
      res,
      getAuthUser
    })

    expect(checkIsLoggedIn).toHaveBeenCalledWith(req, getAuthUser)
    expect(res.cookie).toHaveBeenCalledWith('access_token', '', { maxAge: -1 })
    expect(res.cookie).toHaveBeenCalledWith('logged_in', '', { maxAge: -1 })
    expect(result).toBe(true)
  })

  it('should handle errors', async () => {
    const req = {}
    const res = {
      cookie: jest.fn()
    }
    const getAuthUser = jest.fn()
    const error = new Error('Test error')

    mockCheckIsLoggedIn.mockRejectedValue(error)
    mockErrorHandler.mockImplementation(() => {})

    await authController.logoutHandler(null, null, { req, res, getAuthUser })

    expect(errorHandler).toHaveBeenCalledWith(error)
  })
})
