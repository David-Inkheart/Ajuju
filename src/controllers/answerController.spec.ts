import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import AnswerController from './Answercontroller';
import { findAnswer, updateAnAnswer, answerQuestion, listAnswers, listAnswerstoQuestion, deleteAnanswer } from '../repositories/db.answer';
import { findQuestion } from '../repositories/db.question';

jest.mock('../repositories/db.answer');
jest.mock('../repositories/db.question');

describe('AnswerController', () => {
  describe('list answers to a question', () => {
    it('should fail if validation fails', async () => {
      const questionId = faker.number.float();

      mocked(listAnswerstoQuestion).mockResolvedValue([]);

      await expect(AnswerController.listQuestionAnswers({ questionId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if question is not found', async () => {
      const questionId = faker.number.int({ max: 999999999 });

      mocked(listAnswerstoQuestion).mockResolvedValue([]);

      await expect(AnswerController.listQuestionAnswers({ questionId })).resolves.toMatchObject({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return answers to a question', async () => {
      const questionId = faker.number.int({ max: 999999999 });

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(listAnswerstoQuestion).mockResolvedValue([
        {
          id: faker.number.int({ max: 999999999 }),
          content: faker.lorem.paragraph(),
          authorId: faker.number.int({ max: 999999999 }),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          voteCount: faker.number.int({ min: -100, max: 100 }),
          questionId,
        },
      ]);
    });
  });

  describe('list answers by a user', () => {
    it('should return answers by a user', async () => {
      const authorId = faker.number.int({ max: 999999999 });

      mocked(listAnswers).mockResolvedValue([
        {
          id: faker.number.int({ max: 999999999 }),
          content: faker.lorem.paragraph(),
          authorId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          voteCount: faker.number.int({ min: -100, max: 100 }),
          questionId: faker.number.int({ max: 999999999 }),
        },
      ]);

      await expect(AnswerController.listUserAnswers({ authorId })).resolves.toMatchObject({
        success: true,
        data: {
          answers: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              content: expect.any(String),
            }),
          ]),
        },
      });
    });
  });

  describe('answer a question', () => {
    it('should fail if validation fails', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.float();
      const content = faker.lorem.paragraph();

      await expect(AnswerController.createAnswer({ authorId, questionId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if question is not found', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue(null);

      await expect(AnswerController.createAnswer({ authorId, questionId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should create an answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(answerQuestion).mockResolvedValue({
        id: faker.number.int({ max: 999999999 }),
        content: faker.lorem.paragraph(),
        authorId,
        questionId,
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      await expect(AnswerController.createAnswer({ authorId, questionId, content })).resolves.toMatchObject({
        success: true,
        data: {
          answer: {
            id: expect.any(Number),
            answer: expect.any(String),
          },
        },
      });
    });
  });

  describe('update an answer', () => {
    it('should fail if question validation fails', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.float();
      const answerId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      await expect(AnswerController.updateAnswer({ authorId, questionId, answerId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if answer validation fails', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.float();
      const content = faker.lorem.paragraph();

      await expect(AnswerController.updateAnswer({ authorId, questionId, answerId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if question is not found', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue(null);

      await expect(AnswerController.updateAnswer({ authorId, questionId, answerId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if answer is not found', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue(null);

      await expect(AnswerController.updateAnswer({ authorId, questionId, answerId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if user is not the author of the answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId,
      });

      await expect(AnswerController.updateAnswer({ authorId, questionId, answerId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if the question does have the answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId: faker.number.int({ max: 999999999 }),
      });

      await expect(AnswerController.updateAnswer({ authorId, questionId, answerId, content })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should update an answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });
      const content = faker.lorem.paragraph();

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId,
      });

      mocked(updateAnAnswer).mockResolvedValue({
        id: answerId,
        content,
        authorId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId,
      });
    });
  });

  describe('delete an answer', () => {
    it('should fail if question validation fails', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.float();
      const answerId = faker.number.int({ max: 999999999 });

      await expect(AnswerController.deleteAnswer({ authorId, questionId, answerId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if answer validation fails', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.float();

      await expect(AnswerController.deleteAnswer({ authorId, questionId, answerId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if question is not found', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });

      mocked(findQuestion).mockResolvedValue(null);

      await expect(AnswerController.deleteAnswer({ authorId, questionId, answerId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if answer is not found', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue(null);

      await expect(AnswerController.deleteAnswer({ authorId, questionId, answerId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if user is not the author of the answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId,
      });

      await expect(AnswerController.deleteAnswer({ authorId, questionId, answerId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if the question does have the answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId: faker.number.int({ max: 999999999 }),
      });

      await expect(AnswerController.deleteAnswer({ authorId, questionId, answerId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should delete an answer', async () => {
      const authorId = faker.number.int({ max: 999999999 });
      const questionId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int({ max: 999999999 });

      mocked(findQuestion).mockResolvedValue({
        id: questionId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
      });

      mocked(findAnswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId,
      });

      mocked(deleteAnanswer).mockResolvedValue({
        id: answerId,
        content: faker.lorem.paragraph(),
        authorId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        voteCount: faker.number.int({ min: -100, max: 100 }),
        questionId,
      });
    });
  });
});
