// import { Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

export const listAllQuestions = () => {
  return prisma.question.findMany({
    orderBy: [
      {
        voteCount: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    include: {
      questionVote: true,
    },
  });
};

export const listAskedQuestions = (authorId: number) => {
  return prisma.question.findMany({
    where: {
      authorId,
    },
    orderBy: [
      {
        voteCount: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    include: {
      questionVote: true,
    },
  });
};

export const createAquestion = (authorId: number, title: string, content: string) => {
  return prisma.question.create({
    data: {
      title,
      content,
      authorId,
    },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
};

export const findQuestion = (id: number) => {
  return prisma.question.findUnique({
    where: {
      id,
    },
  });
};

export const updateQuestion = ({ id, title, content }: { id: number; title: string; content: string }) => {
  return prisma.question.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
};

export const deleteAquestion = (id: number) => {
  return prisma.question.delete({
    where: {
      id,
    },
  });
};
