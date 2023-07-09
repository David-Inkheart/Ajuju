import { Prisma, VoteType } from '@prisma/client';
import prisma from '../utils/db.server';

export const userQuestionVote = (userId: number, questionId: number) => {
  return prisma.questionVote.findFirst({
    where: {
      userId,
      questionId,
    },
  });
};

export const deleteQuestionVote = (id: number) => {
  return prisma.questionVote.delete({
    where: {
      id,
    },
  });
};

export const updateVoteCount = (id: number, voteType: VoteType) => {
  return prisma.question.update({
    where: {
      id,
    },
    data: {
      voteCount: {
        increment: voteType === 'UPVOTE' ? -1 : 1,
      },
    },
  });
};

export const updateVoteCount2 = (id: number, voteType: VoteType) => {
  return prisma.question.update({
    where: {
      id,
    },
    data: {
      voteCount: {
        increment: voteType === 'UPVOTE' ? 2 : -2,
      },
    },
  });
};

export const updateQuestionVote = (id: number, voteType: VoteType) => {
  return prisma.questionVote.update({
    where: {
      id,
    },
    data: {
      voteType,
    },
  });
};

export const createQuestionVote = (userId: number, questionId: number, voteType: VoteType) => {
  return prisma.questionVote.create({
    data: {
      voteType,
      question: {
        connect: {
          id: questionId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const changeQuestionVoteCount = (id: number, voteType: VoteType) => {
  return prisma.question.update({
    where: {
      id,
    },
    data: {
      voteCount: {
        increment: voteType === 'UPVOTE' ? 1 : -1,
      },
    },
  });
};
