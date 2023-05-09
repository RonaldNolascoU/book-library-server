import { AuthenticationError } from 'apollo-server-core'
import errorHandler from '../controllers/error.controller.ts'

const checkIsLoggedIn = async (req, getAuthUser) => {
  try {
    // Check if user is logged in
    const authUser = await getAuthUser(req)

    if (!authUser) {
      throw new AuthenticationError('You are not logged in')
    }

    return authUser
  } catch (error) {
    errorHandler(error)
  }
}

export default checkIsLoggedIn
