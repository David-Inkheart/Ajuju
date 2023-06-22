import { Request, Response } from 'express'

import prisma from '../utils/db.server'
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { UserId } from "../types/custom"


class PasswordController {
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = req.userId as UserId

      // password validation
      if (!currentPassword || currentPassword.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Current password cannot be empty"
        })
      }

      // password validation
      if (!newPassword || newPassword.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "New password cannot be empty"
        })
      }

      // check if current password is the same as the new password
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password cannot be the same as the current password"
        })
      }

      // validate password length
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters long"
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
          message: "User does not exist"
        })
      }

      // compare old password with the one in the database
      const isPasswordValid = await comparePasswords(currentPassword, existingUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect"
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
        message: "Something went wrong"
      })
    }
  }
}

export default PasswordController;