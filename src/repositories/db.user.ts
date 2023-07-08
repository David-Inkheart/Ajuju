import { Prisma } from '@prisma/client';
import prisma from '../utils/db.server';
import { UserId } from '../types/custom';

export const findUser = (data: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where: data });
};

export const createUser = (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const updateUser = (id: number, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};

export const findProfile = (data: Prisma.ProfileWhereUniqueInput) => {
  return prisma.profile.findUnique({ where: data });
};

export const checkUserFollower = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      follower: true,
    },
  });
};

export const followTheUser = (id: UserId, userId: UserId) => {
  return prisma.follows.create({
    data: {
      follower: {
        connect: {
          id: userId,
        },
      },
      following: {
        connect: {
          id,
        },
      },
    },
  });
};

export const unfollowTheUser = (id: UserId, userId: UserId) => {
  return prisma.follows.delete({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: id,
      },
    },
  });
};

export const getUserWithFollowings = (id: UserId) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      following: true,
    },
  });
};

export const allUsersFollowed = (usersFollowed: number[]) => {
  return prisma.user.findMany({
    where: {
      id: {
        in: usersFollowed,
      },
    },
    select: {
      id: true,
      username: true,
    },
  });
};
