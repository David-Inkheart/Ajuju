import { mocked } from 'jest-mock';
import { faker } from '@faker-js/faker';

import prisma from '../utils/db.server';
import { listAnswers, answerQuestion } from './db.answer';

jest.mock('../utils/db.server', () => ({
  __esModule: true,
  default: {
    answer: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('answerService', () => {
  describe('listAnswers', () => {
    it('should return a list of answers for a given ID', async () => {
      const id = faker.number.int();
      const answers = [
        {
          id: faker.number.int(),
          questionId: faker.number.int(),
          authorId: faker.number.int(),
          content: faker.lorem.paragraph(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
        {
          id: faker.number.int(),
          questionId: faker.number.int(),
          authorId: faker.number.int(),
          content: faker.lorem.paragraph(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
      ];

      mocked(prisma.answer.findMany).mockResolvedValueOnce(answers);

      await expect(listAnswers(id)).resolves.toBe(answers);

      expect(prisma.answer.findMany).toHaveBeenCalledWith({
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
    });

    it('should return an empty list if no answers are found', async () => {
      const id = faker.number.int();

      mocked(prisma.answer.findMany).mockResolvedValueOnce([]);

      await expect(listAnswers(id)).resolves.toEqual([]);

      expect(prisma.answer.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('listAnswerstoQuestion', () => {
    it('should return a list of answers for a given question ID', async () => {
      const questionId = faker.number.int();
      const answers = [
        {
          id: faker.number.int(),
          questionId: faker.number.int(),
          authorId: faker.number.int(),
          content: faker.lorem.paragraph(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
        {
          id: faker.number.int(),
          questionId: faker.number.int(),
          authorId: faker.number.int(),
          content: faker.lorem.paragraph(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
      ];

      mocked(prisma.answer.findMany).mockResolvedValueOnce(answers);

      await expect(listAnswers(questionId)).resolves.toBe(answers);
    });

    it('should return an empty list if no answers are found', async () => {
      const questionId = faker.number.int();

      mocked(prisma.answer.findMany).mockResolvedValueOnce([]);

      await expect(listAnswers(questionId)).resolves.toEqual([]);
    });
  });

  describe('answerQuestion', () => {
    it('should create an answer for a given question', async () => {
      const authorId = faker.number.int();
      const questionId = faker.number.int();
      const content = faker.lorem.paragraph();
      const answer = {
        id: faker.number.int(),
        questionId,
        authorId,
        content,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };

      mocked(prisma.answer.create).mockResolvedValueOnce(answer);

      await expect(answerQuestion(authorId, questionId, content)).resolves.toBe(answer);

      expect(prisma.answer.create).toHaveBeenCalledWith({
        data: {
          authorId,
          questionId,
          content,
        },
      });
    });
  });
});
