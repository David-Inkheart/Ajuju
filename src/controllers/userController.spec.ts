import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import UserController from './Usercontroller';
import {
  checkUserFollower,
  findProfile,
  findUser,
  followTheUser,
  unfollowTheUser,
  getUserWithFollowings,
  allUsersFollowed,
} from '../repositories/db.user';

jest.mock('../repositories/db.user');

describe('User controller', () => {
  describe('searchAccount', () => {
    it('should return an error if the email is invalid', async () => {
      const email = 'invalid-email';
      const response = await UserController.searchAccount({ email });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is not found', async () => {
      const email = faker.internet.email();
      mocked(findUser).mockResolvedValueOnce(null);
      const response = await UserController.searchAccount({ email });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return the user profile', async () => {
      const email = faker.internet.email();
      const user = {
        id: faker.number.int({ max: 999999999 }),
        username: faker.internet.userName(),
        email,
        createdAt: faker.date.past(),
        password: faker.internet.password(),
      };
      const profile = {
        id: faker.number.int({ max: 999999999 }),
        bio: faker.lorem.paragraph(),
        userId: user.id,
      };
      mocked(findUser).mockResolvedValueOnce(user);
      mocked(findProfile).mockResolvedValueOnce(profile);
      const response = await UserController.searchAccount({ email });
      expect(response).toEqual({
        success: true,
        message: expect.any(String),
        data: {
          username: user.username,
          email: user.email,
          bio: profile.bio,
          createdAt: user.createdAt,
        },
      });
    });
  });

  describe('followUser', () => {
    it('should return an error if the id is invalid', async () => {
      const id = faker.number.float();
      const userId = faker.number.int({ max: 999999999 });
      const response = await UserController.followUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is trying to follow himself', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = id;
      const response = await UserController.followUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is not found', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = faker.number.int({ max: 999999999 });
      mocked(checkUserFollower).mockResolvedValueOnce(null);
      const response = await UserController.followUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is already being followed', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = faker.number.int({ max: 999999999 });
      const user = {
        id,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        password: faker.internet.password(),
        follower: [
          {
            id: faker.number.int({ max: 999999999 }),
            followerId: userId,
            followingId: id,
          },
        ],
      };
      mocked(findUser).mockResolvedValueOnce(user);
      const response = await UserController.followUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should follow the user', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = faker.number.int({ max: 999999999 });
      const user = {
        id,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        password: faker.internet.password(),
        follower: [],
      };
      mocked(checkUserFollower).mockResolvedValueOnce(user);
      mocked(followTheUser).mockResolvedValueOnce({
        followerId: userId,
        followingId: id,
      });
      const response = await UserController.followUser({ id, userId });
      expect(response).toEqual({
        success: true,
        message: expect.any(String),
      });
    });
  });

  describe('unfollowUser', () => {
    it('should return an error if the id is invalid', async () => {
      const id = faker.number.float();
      const userId = faker.number.int({ max: 999999999 });
      const response = await UserController.unfollowUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is trying to unfollow himself', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = id;
      const response = await UserController.unfollowUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is not found', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = faker.number.int({ max: 999999999 });
      mocked(checkUserFollower).mockResolvedValueOnce(null);
      const response = await UserController.unfollowUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return an error if the user is not being followed', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = faker.number.int({ max: 999999999 });
      const user = {
        id,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        password: faker.internet.password(),
        follower: [],
      };
      mocked(checkUserFollower).mockResolvedValueOnce(user);
      const response = await UserController.unfollowUser({ id, userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should unfollow the user', async () => {
      const id = faker.number.int({ max: 999999999 });
      const userId = faker.number.int({ max: 999999999 });
      const user = {
        id,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        password: faker.internet.password(),
        follower: [
          {
            id: faker.number.int({ max: 999999999 }),
            followerId: id,
            followingId: userId,
          },
        ],
      };
      mocked(checkUserFollower).mockResolvedValueOnce(user);
      mocked(unfollowTheUser).mockResolvedValueOnce({
        followerId: id,
        followingId: userId,
      });
      const response = await UserController.unfollowUser({ id, userId });
      expect(response).toEqual({
        success: true,
        message: expect.any(String),
      });
    });
  });

  describe('getUserFollowings', () => {
    it('should return an error if the user is not found', async () => {
      const userId = faker.number.int({ max: 999999999 });
      mocked(getUserWithFollowings).mockResolvedValueOnce(null);
      const response = await UserController.getFollowing({ userId });
      expect(response).toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return the user followings', async () => {
      const userId = faker.number.int({ max: 999999999 });
      const user = {
        id: userId,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        password: faker.internet.password(),
        following: [
          {
            id: faker.number.int({ max: 999999999 }),
            followerId: userId,
            followingId: faker.number.int({ max: 999999999 }),
          },
        ],
      };
      mocked(getUserWithFollowings).mockResolvedValueOnce(user);
      mocked(allUsersFollowed).mockResolvedValueOnce([
        {
          id: faker.number.int({ max: 999999999 }),
          username: faker.internet.userName(),
        },
      ]);
      const response = await UserController.getFollowing({ userId });
      expect(response).toEqual({
        success: true,
        message: expect.any(String),
        data: {
          followedUsers: [
            {
              id: expect.any(Number),
              username: expect.any(String),
            },
          ],
        },
      });
    });

    it('should return an empty array if the user is not following anyone', async () => {
      const userId = faker.number.int({ max: 999999999 });
      const user = {
        id: userId,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        password: faker.internet.password(),
        following: [],
      };
      mocked(getUserWithFollowings).mockResolvedValueOnce(user);
      const response = await UserController.getFollowing({ userId });
      expect(response).toEqual({
        success: true,
        message: expect.any(String),
        data: {
          followedUsers: [],
        },
      });
    });
  });
});
