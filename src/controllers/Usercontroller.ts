import { searchSchema, followSchema, bioSchema } from '../utils/validators';
import {
  allUsersFollowed,
  checkUserFollower,
  createProfile,
  findProfile,
  findUser,
  followTheUser,
  getUserWithFollowings,
  unfollowTheUser,
  updateTheProfile,
} from '../repositories/db.user';

class UserController {
  // get profile of a user who owns the provided email
  static async searchAccount({ email }: { email: string }) {
    const { error } = searchSchema.validate({ email });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    const user = await findUser({ email });
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const profile = await findProfile({ userId: user.id });
    return {
      success: true,
      message: 'Successfully retrieved user profile',
      // select some user data and profile bio alone
      data: { id: user.id, username: user.username, email: user.email, bio: profile?.bio, createdAt: user.createdAt },
    };
  }

  // follow a user
  static async followUser({ id, userId }: { id: number; userId: number }) {
    // validate the id
    const { error } = followSchema.validate({ id });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // check if the user is trying to follow himself
    if (userId === Number(id)) {
      return {
        success: false,
        error: 'You cannot follow yourself',
      };
    }
    // get user with the follower array
    const user = await checkUserFollower(Number(id));
    // if the user is not found
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    // if the user is already being followed
    const isFollowing = user.follower.find((fllwer) => fllwer.followingId === userId);
    // console.log(isFollowing)
    if (isFollowing) {
      return {
        success: false,
        error: `You are already following ${user.username}`,
      };
    }
    // follow the user
    await followTheUser(userId, Number(id));
    return {
      success: true,
      message: `You are now following ${user.username}`,
    };
  }

  static async unfollowUser({ id, userId }: { id: number; userId: number }) {
    // validate the id
    const { error } = followSchema.validate({ id });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // check if the user is trying to unfollow himself
    if (userId === Number(id)) {
      return {
        success: false,
        error: 'You cannot unfollow yourself',
      };
    }
    // get user with the follower array
    const user = await checkUserFollower(Number(id));
    // if the user is not found
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    // if the user is not being followed
    const isFollowing = user.follower.find((fllwer) => fllwer.followingId === userId);
    if (!isFollowing) {
      return {
        success: false,
        error: 'You are not following this user',
      };
    }
    // unfollow the user
    await unfollowTheUser(userId, Number(id));
    return {
      success: true,
      message: `You have unfollowed ${user.username}`,
    };
  }

  // get all users a user is following
  static async getFollowing({ userId }: { userId: number }) {
    const user = await getUserWithFollowings(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const getFollowedUserId = user.following.map((followedUser) => followedUser.followerId);

    const followedUsers = await allUsersFollowed(getFollowedUserId);
    return {
      success: true,
      message: 'Successfully retrieved followed accounts',
      data: {
        followedUsers: followedUsers || [],
      },
    };
  }

  // get all followers of a user
  static async getFollowers({ userId }: { userId: number }) {
    const user = await checkUserFollower(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    const getFollowersId = user.follower.map((follower) => follower.followingId);

    const followers = await allUsersFollowed(getFollowersId);
    return {
      success: true,
      message: 'Successfully retrieved followers',
      data: {
        followers: followers || [],
      },
    };
  }

  // update user profile
  static async updateProfile({ userId, bio }: { userId: number; bio: string }) {
    const { error } = bioSchema.validate({ bio });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // get the user
    const user = await findUser({ id: userId });
    // create a profile if the user does not have one
    const profile = await findProfile({ userId });
    if (!profile) {
      await createProfile({ userId, bio });
      return {
        success: true,
        message: 'Successfully created a profile',
        data: {
          userId,
          username: user!.username,
          bio,
        },
      };
    }
    // else update the profile
    const updatedProfile = await updateTheProfile({ userId, bio });

    return {
      success: true,
      message: 'Successfully updated profile',
      data: {
        userId: updatedProfile.userId,
        username: user!.username,
        bio: updatedProfile.bio,
      },
    };
  }
}

export default UserController;
