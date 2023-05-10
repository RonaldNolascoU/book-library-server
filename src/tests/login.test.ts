import authController, { signTokens } from '../controllers/auth.controller'
import { Request, Response } from 'express'
import { UserModel } from '../models/user.model'

jest.mock('../models/user.model')

describe('login function', () => {
  it('should return user data and access token on successful login', async () => {
    // Mock data and functions
    const email = 'test@example.com'
    const password = 'testpassword'
    const mockUser = { email, password, comparePasswords: jest.fn(() => true) }
    const mockReq = {} as Request
    const mockRes = { cookie: jest.fn() } as unknown as Response

    UserModel.findOne = jest.fn().mockResolvedValue(mockUser)
    UserModel.comparePasswords = jest.fn().mockResolvedValue(true)

    // Call the login function
    const result = await authController.login(
      null,
      { input: { email, password } },
      { req: mockReq, res: mockRes }
    )

    // Assertions
    expect(UserModel.findOne).toHaveBeenCalledWith({ email })
    expect(mockRes.cookie).toHaveBeenCalledTimes(2)
    expect(result.status).toBe(true)
    expect(result.user).toEqual(mockUser)
  })
})
