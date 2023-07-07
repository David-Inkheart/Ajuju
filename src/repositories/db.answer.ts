// import { Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

export const listAnswers = (id: number) => {
  return prisma.answer.findMany({
    where: {
      id,
    },
    orderBy: [
      {
        voteCount: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });
};

export const listAnswerstoQuestion = (questionId: number) => {
  return prisma.answer.findMany({
    where: {
      questionId,
    },
    orderBy: [
      {
        voteCount: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });
};

export const answerQuestion = (authorId: number, questionId: number, content: string) => {
  return prisma.answer.create({
    data: {
      authorId,
      questionId,
      content,
    },
  });
};

export const findAnswer = (id: number) => {
  return prisma.answer.findUnique({
    where: {
      id,
    },
  });
};

export const updateAnAnswer = (id: number, content: string) => {
  return prisma.answer.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
};

export const checkAnswer = (questionId: number, answerId: number) => {
  return prisma.question.findFirst({
    where: {
      id: questionId,
      answer: {
        some: {
          id: answerId,
        },
      },
    },
  });
};

export const deleteAnanswer = (id: number) => {
  return prisma.answer.delete({
    where: {
      id,
    },
  });
};
