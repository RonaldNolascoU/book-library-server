import { ForbiddenError } from 'apollo-server-core'
import errorHandler from '../controllers/error.controller.ts'
import { verifyJwt } from '../utils/jwt.ts'
import { UserModel } from '../models/user.model.ts'

const authUser = async (req) => {
  try {
    // Get the access token
    let access_token = ''
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.access_token) {
      const { access_token: token } = req.cookies
      access_token = token
      console.log({ access_token }, 'cookie')
    }

    if (!access_token) return false

    // Validate the Access token
    const decoded = verifyJwt(access_token)

    if (!decoded) return false

    console.log({ decoded })

    // Check if user exist
    const user = await UserModel.findById(decoded.user).populate('books')

    if (!user) {
      throw new ForbiddenError(
        'The user belonging to this token no logger exist'
      )
    }

    return user
  } catch (error) {
    errorHandler(error)
  }
}

export default authUser
