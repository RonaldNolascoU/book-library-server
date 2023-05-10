import { describe, it, expect } from '@jest/globals'
import { UserModel } from '../models/user.model'
import { ForbiddenError } from 'apollo-server-core'
import authController from '../controllers/auth.controller'

jest.mock('../models/user.model')

describe('create a new user', () => {
  it('should create a user and return status and user object', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' }
    ;(UserModel.create as jest.Mock).mockResolvedValue(mockUser)

    const result = await authController.signup({
      input: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password'
      }
    })

    expect(UserModel.create).toHaveBeenCalled()
    expect(result).toEqual({ status: true, user: mockUser })
  })

  it('should throw a ForbiddenError if user already exists', async () => {
    ;(UserModel.create as jest.Mock).mockRejectedValue({ code: 11000 })

    await expect(
      authController.signup({
        input: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password'
        }
      })
    ).rejects.toThrow(ForbiddenError)
  })
})
