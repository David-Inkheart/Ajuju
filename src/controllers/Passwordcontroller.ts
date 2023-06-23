import { Request, Response } from 'express'

import prisma from '../utils/db.server'
import redisClient from '../redisClient';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { UserId } from "../types/custom"
import mockPasswordResetEmail from '../utils/emailService';


class PasswordController {
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = req.userId as UserId

      // password validation
      if (!currentPassword || currentPassword.trim() === '') {
        return res.status(400).json({
          success: false,
          error: "invalid current password"
        })
      }

      // password validation
      if (!newPassword || newPassword.trim() === '') {
        return res.status(400).json({
          success: false,
          error: "invalid new password"
        })
      }

      // check if current password is the same as the new password
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          error: "New password cannot be the same as the current password"
        })
      }

      // validate password length
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 8 characters long"
        })
      }

      // check if user is already existing
      const existingUser = await prisma.user.findFirst({
        where: {
          id: userId
        }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: "User does not exist"
        })
      }

      // compare old password with the one in the database
      const isPasswordValid = await comparePasswords(currentPassword, existingUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect"
        })
      }

      // hash the password
      const hashedPassword = await hashPassword(newPassword);

      // update the user's password
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          password: hashedPassword
        }
      })

      return res.status(200).json({
        success: true,
        message: "Password changed successfully"
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        error: "Could not change password"
      })
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body

      // check if email is valid
      if (!email || email.trim() === '') {
        return res.status(400).json({
          success: false,
          error: "Please provide your email address"
        })
      }
      
      // validate email format
      if (!email.includes('@') || !email.includes('.') || email.length < 5) {
        return res.status(400).json({
          success: false,
          error: "invalid email format"
        })
      }

      // check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      });
      console.log(existingUser)

      // generate a 5-digit code
      const passwordResetToken = Math.floor(10000 + Math.random() * 90000);

      // save the code to the Redis store with an expiration of 10 minutes

      if (existingUser) {
        const key = `password-reset-token-${existingUser.id}`;
        try {
          await redisClient.setEx(key, 600,  passwordResetToken.toString());
        }
        catch (error) {
          console.log(error)
          return res.status(500).json({
            success: false,
            error: "Could not cache the password reset token"
          })
        }
      }

      // send the code to the user's email
      const recipient = email;
      const subject = "Password Reset";
      const message = `Your password reset code is: ${passwordResetToken}`;

      try {
        await mockPasswordResetEmail(recipient, subject, message);
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({
          success: false,
          error: "Could not send the password reset code to your email address"
        })
      }

      return res.status(200).json({
        success: true,
        message: "A 5-digit code has been sent to your email address to complete the password reset process"
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        error: "Could not reset password"
      })
    }
  }
}

export default PasswordController;