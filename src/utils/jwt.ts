import jwt, { SignOptions } from 'jsonwebtoken'
import errorHandler from '../controllers/error.controller'

export const signJwt = (payload: any, options?: SignOptions) => {
  const jwtKey: any = process.env.JWT_ACCESS_PRIVATE_KEY
  return jwt.sign(payload, jwtKey, {
    ...(options && options)
  })
}

export const verifyJwt = (token: string) => {
  try {
    console.log({ token })
    const jwtKey: any = process.env.JWT_ACCESS_PRIVATE_KEY
    const decoded = jwt.verify(token, jwtKey)
    return decoded
  } catch (error) {
    errorHandler(error)
  }
}
