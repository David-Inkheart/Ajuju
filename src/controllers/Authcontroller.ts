import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import prisma from '../utils/db.server';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { registerSchema, loginSchema } from '../utils/validators';

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // validate user input
      const { error } = registerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      // check if user is already existing
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with same email or username already exists',
        });
      }

      // hash the password
      const hashedPassword = await hashPassword(password);

      // save user to db
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      // generate jwt Token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while registering the user',
        error: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // validate user input
      const { error } = loginSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
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
          message: 'Invalid email',
        });
      }

      // Compare the password
      const isMatch = await comparePasswords(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password',
        });
      }
      // Generate JWT token that expires in 1 hour
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        token,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while logging in',
        error: error.message,
      });
    }
  }
}

export default AuthController;
