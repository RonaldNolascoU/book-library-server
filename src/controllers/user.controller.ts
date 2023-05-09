import checkIsLoggedIn from '../middleware/checkIfLoggedIn.ts'
import errorHandler from './error.controller.ts'

const getMe = async (_, args, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser)

    const user = await getAuthUser(req)

    return {
      status: true,
      user
    }
  } catch (error) {
    errorHandler(error)
  }
}

export default {
  getMe
}
