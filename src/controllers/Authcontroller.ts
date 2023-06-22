import { Request, Response } from 'express'
import jwt from 'jsonwebtoken';

import prisma from '../utils/db.server'
import { hashPassword, comparePasswords } from '../utils/passwordService';

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body

      // email validation
      if (!email || email.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty"
        })
      }

      // password validation
      if (!password || password.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Password cannot be empty"
        })
      }

      // username validation
      if (!username || username.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Username cannot be empty"
        })
      }

      // validate password length
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long"
        })
      }

      // check if user is already existing
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }]
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with same email or username already exists"
        })
      }

      // hash the password
      const hashedPassword = await hashPassword(password);

      // save user to db
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        }
      });

      // generate jwt Token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while registering the user',
        error: error.message,
      });
    }
  }


  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // email validation
      if (!email || email.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      // password validation
      if (!password || password.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Password is required',
        });
      }

      // Find the user by email
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Compare the password
      const isMatch = await comparePasswords(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        token,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while logging in',
        error: error.message,
      });
    }
  }
}

export default AuthController;