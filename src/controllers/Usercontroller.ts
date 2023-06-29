import { Request, Response } from 'express'
import prisma from '../utils/db.server'
import { searchSchema, followSchema } from '../utils/validators'

class UserController {
  // GET: get profile of a user who owns the provided email
  static async searchAccount(req: Request, res: Response) {
    try {
      const { email } = req.query

      // validate the email
      const { error } = searchSchema.validate({ email })
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      const user = await prisma.user.findUnique({
        where: {
          email: email as string
        }
      })
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }
      const profile = await prisma.profile.findUnique({
        where: {
          userId: user.id
        }
      })
      return res.status(200).json({
        status: 'success',
        // select some user data and profile bio alone
        data: { username: user.username, email: user.email, bio: profile?.bio, createdAt: user.createdAt }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'Internal server error'
      })
    }
  }

  // POST: follow a user
  static async followUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      // validate the id
      const { error } = followSchema.validate({ id })
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      const userId = req.userId
      // check if the user is trying to follow himself
      if (userId === Number(id)) {
        return res.status(400).json({
          success: false,
          error: "You cannot follow yourself"
        })
      }
      // check if the user is already being followed
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id)
        },
        include: {
          follower: true
        }
      })
      // if the user is not found
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        })
      }
      // if the user is already being followed
      const isFollowing = user.follower.find((fllwer) => fllwer.followingId === userId)
      // console.log(isFollowing)
      if (isFollowing) {
        return res.status(400).json({
          success: false,
          error: "You are already following this user"
        })
      }
      // follow the user
      await prisma.follows.create({
        data: {
          follower: {
            connect: {
              id: Number(id)
            }
          },
          following: {
            connect: {
              id: userId
            }
          }
        }
      })
      return res.status(200).json({
        success: true,
        message: "You are now following this user"
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "something went wrong, please try again later"
      })
    }
  }

  static async unfollowUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      // validate the id
      const { error } = followSchema.validate({ id })
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      const userId = req.userId!

      // check if the user is trying to unfollow himself
      if (userId === Number(id)) {
        return res.status(400).json({
          success: false,
          error: "You cannot unfollow yourself"
        })
      }
      // check if the user is already being followed
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id)
        },
        include: {
          follower: true
        }
      })
      // if the user is not found
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        })
      }
      // if the user is not being followed
      const isFollowing = user.follower.find((fllwer) => fllwer.followingId === userId)
      // console.log(isFollowing)
      if (!isFollowing) {
        return res.status(400).json({
          success: false,
          error: "You are not following this user"
        })
      }
      // unfollow the user
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: Number(id),
            followingId: userId
          }
        }
      })
      return res.status(200).json({
        success: true,
        message: "You have unfollowed this user"
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error"
      })
    }
  }

  // GET: get all users a user is following
  static async getFollowing(req: Request, res: Response) {
    try {
      const userId = req.userId! 

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          following: true
        }
      })
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        })
      }
      if (user.following.length === 0) {
        return res.status(200).json({
          success: true,
          message: "You are not following any user"
        })
      }
      // console.log(user.following)
      const getFollowedUserId = user.following.map((followedUser) => followedUser.followerId)
      // console.log(getFollowedUserId)
      const followedUsers = await prisma.user.findMany({
        where: {
          id: {
            in: getFollowedUserId
          }
        },
        select: {
          id: true,
          username: true,
        }
      })
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved followed accounts",
        data: followedUsers
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "something went wrong, please try again later"
      })
    }
  }

  // GET: get all users following a user
  static async getFollowers(req: Request, res: Response) {
    try {
      const userId = req.userId!

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          follower: true
        }
      })
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        })
      }
      if (user.follower.length === 0) {
        return res.status(200).json({
          success: true,
          message: "You have no followers"
        })
      }
      // console.log(user.following)
      const getFollowersId = user.follower.map((follower) => follower.followingId)
      // console.log(getFollowedUserId)
      const followers = await prisma.user.findMany({
        where: {
          id: {
            in: getFollowersId
          }
        },
        select: {
          id: true,
          username: true,
        }
      })
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved following accounts",
        data: followers
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "something went wrong, please try again later"
      })
    }
  }
}

export default UserController
