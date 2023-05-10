import { AuthenticationError, ForbiddenError } from 'apollo-server-core'
import config from 'config'
import errorHandler from './error.controller'
import { signJwt } from '../utils/jwt'
import { Request, Response } from 'express'
import checkIsLoggedIn from '../middleware/checkIfLoggedIn'
import { UserModel } from '../models/user.model'

const cookieOptions = {
  domain: 'localhost',
  path: '/'
}

// if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

interface LoginInput {
  email: string
  password: string
}

// ? SignUp User
const signup = async ({ input: { name, email, password } }) => {
  try {
    const user = await UserModel.create({
      name,
      email,
      password
    })

    return {
      status: true,
      user
    }
  } catch (error) {
    if (error.code === 11000) {
      throw new ForbiddenError('User already exist')
    }
    errorHandler(error)
  }
}

// ? Sign Tokens
export async function signTokens(user) {
  // Create access token
  const access_token = signJwt(
    { user: user.id },
    {
      expiresIn: '365d'
    }
  )

  return { access_token }
}

const login = async (
  parent: any,
  { input: { email, password } }: { input: LoginInput },
  { req, res }: { req: Request; res: Response }
): Promise<any> => {
  try {
    // Check if user exist and password is correct
    const user: any = await UserModel.findOne({ email })
    if (!user || !(await UserModel.comparePasswords(password, user.password))) {
      throw new AuthenticationError('Invalid email or password')
    }
    user.password = undefined

    // Create a session and tokens
    const { access_token } = await signTokens(user)

    // Add refreshToken to cookie
    res.cookie('access_token', access_token, { ...cookieOptions })
    res.cookie('logged_in', true, { httpOnly: false })

    return {
      status: true,
      user,
      access_token
    }
  } catch (error) {
    errorHandler(error)
    return {
      status: false
    }
  }
}

// ? Logout User
const logoutHandler = async (_, args, { req, res, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser)
    // Logout user
    res.cookie('access_token', '', { maxAge: -1 })
    res.cookie('logged_in', '', { maxAge: -1 })

    return true
  } catch (error) {
    errorHandler(error)
  }
}

export default {
  signup,
  login,
  logoutHandler
}
