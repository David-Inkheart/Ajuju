import { Request, Response } from 'express';

import prisma from '../utils/db.server';
import redisClient from '../redisClient';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { UserId } from '../types/custom';
import mockPasswordResetEmail from '../utils/emailService';
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validators';

class PasswordController {
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId as UserId;

      // validate the request body
      const { error } = changePasswordSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      // compare old password with the one in the database
      const isPasswordValid = await comparePasswords(currentPassword, existingUser!.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect',
        });
      }

      // hash the password
      const hashedPassword = await hashPassword(newPassword);

      // update the user's password
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Could not change password',
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // validate the user input
      const { error } = forgotPasswordSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      // check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // generate a 5-digit code
      const passwordResetToken = Math.floor(10000 + Math.random() * 90000);

      // save the code to the Redis store with an expiration of 10 minutes

      if (existingUser) {
        const key = `password-reset-token-${existingUser.id}`;
        try {
          await redisClient.setEx(key, 600, passwordResetToken.toString());
        } catch (err) {
          return res.status(500).json({
            success: false,
            error: 'Could not cache the password reset token',
          });
        }
        // send the code to the user's email
        const recipient = email;
        const subject = 'Password Reset';
        const message = `Your password reset code is: ${passwordResetToken}`;

        try {
          await mockPasswordResetEmail(recipient, subject, message);
        } catch (err) {
          return res.status(500).json({
            success: false,
            error: 'Could not send the password reset code to your email address',
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'A 5-digit code has been sent to your email address to complete the password reset process',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Could not reset password',
      });
    }
  }

  static async confirmResetPassword(req: Request, res: Response) {
    try {
      const { email, code, newPassword } = req.body;

      // validate the user input
      const { error } = resetPasswordSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      // check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User does not exist',
        });
      }

      // check if the newPassword is the same as the current password
      const isPasswordValid = await comparePasswords(newPassword, existingUser.password);

      if (isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'New password cannot be the same as the current password',
        });
      }

      // check if the code is valid
      const key = `password-reset-token-${existingUser.id}`;
      const cachedCode = await redisClient.get(key);

      if (!cachedCode) {
        return res.status(400).json({
          success: false,
          error: 'The code has expired',
        });
      }

      if (cachedCode !== code) {
        return res.status(400).json({
          success: false,
          error: 'The code is invalid',
        });
      }

      // hash the password
      const hashedPassword = await hashPassword(newPassword);

      // update the user's password
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      // delete the code from the Redis store
      await redisClient.del(key);

      return res.status(200).json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Could not reset password',
      });
    }
  }
}

export default PasswordController;
