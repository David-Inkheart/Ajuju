import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import QuestionController from './Questioncontroller';
import { listAllQuestions, listAskedQuestions, createAquestion, updateQuestion, findQuestion, deleteAquestion } from '../repositories/db.question';

jest.mock('../repositories/db.question');

describe('QuestionController', () => {
  describe('list All Questions', () => {
    it('should return a list of all questions', async () => {
      const questions = [
        {
          id: faker.number.int(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorId: faker.number.int(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          answer: [],
          questionVote: [],
        },
        {
          id: faker.number.int(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorId: faker.number.int(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          answer: [],
          questionVote: [],
        },
      ];

      mocked(listAllQuestions).mockResolvedValueOnce(questions);

      await expect(QuestionController.listQuestions()).resolves.toEqual({
        questions: questions.map((question) => ({
          id: question.id,
          title: question.title,
          content: question.content,
          authorId: question.authorId,
          votes: question.voteCount,
        })),
      });
    });

    it('should return an error message if there was an error retrieving the questions', async () => {
      mocked(listAllQuestions).mockRejectedValueOnce(new Error('Error'));

      await expect(QuestionController.listQuestions()).rejects.toThrow('Error');
    });
  });

  describe('list User Questions', () => {
    it('should return a list of all questions asked by a user', async () => {
      const authorId = faker.number.int();

      const questions = [
        {
          id: faker.number.int(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorId,
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          answer: [],
          questionVote: [],
        },
        {
          id: faker.number.int(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorId: faker.number.int(),
          voteCount: faker.number.int(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          answer: [],
          questionVote: [],
        },
      ];

      const userQuestions = questions.filter((question) => question.authorId === authorId);

      mocked(listAskedQuestions).mockResolvedValueOnce(userQuestions);

      await expect(QuestionController.listUserQuestions(authorId)).resolves.toEqual({
        questions: userQuestions.map((question) => ({
          id: question.id,
          title: question.title,
          content: question.content,
          votes: question.voteCount,
        })),
      });
    });

    it('should return an error message if there was an error retrieving the questions', async () => {
      const authorId = faker.number.int();

      mocked(listAskedQuestions).mockRejectedValueOnce(new Error('Error'));

      await expect(QuestionController.listUserQuestions(authorId)).rejects.toThrow('Error');
    });

    it('should return an empty array if the user has not asked any questions', async () => {
      const authorId = faker.number.int();

      mocked(listAskedQuestions).mockResolvedValueOnce([]);

      await expect(QuestionController.listUserQuestions(authorId)).resolves.toEqual({
        questions: [],
      });
    });
  });

  describe('create Question', () => {
    it('should fail if validation fails', async () => {
      const title = faker.lorem.sentence();
      const content = '';
      const authorId = faker.number.int();

      await expect(QuestionController.createQuestion(title, content, authorId)).resolves.toMatchObject({
        success: false,
      });
    });

    it('should return a success message if the question was created successfully', async () => {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const authorId = faker.number.int();

      const question = {
        id: faker.number.int(),
        title,
        content,
        authorId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(createAquestion).mockResolvedValueOnce(question);

      await expect(QuestionController.createQuestion(title, content, authorId)).resolves.toEqual({
        success: true,
        message: 'Successfully created a new question',
        data: {
          question,
        },
      });
    });
  });

  describe('update Question', () => {
    it('should fail if validation fails', async () => {
      const title = faker.lorem.sentence();
      const content = '';
      const authorId = faker.number.int();
      const id = faker.number.int();

      await expect(QuestionController.updateQuestion({ authorId, id, title, content })).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail is id is not an int', async () => {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const authorId = faker.number.int();
      const id = faker.number.float();

      await expect(QuestionController.updateQuestion({ authorId, id, title, content })).resolves.toMatchObject({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if the question does not exist', async () => {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const authorId = faker.number.int();
      const id = faker.number.int();

      mocked(findQuestion).mockResolvedValueOnce(null);

      await expect(QuestionController.updateQuestion({ authorId, id, title, content })).resolves.toMatchObject({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if the user is not the author of the question', async () => {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const authorId = faker.number.int();
      const id = faker.number.int();

      const question = {
        id,
        title,
        content,
        authorId: faker.number.int(),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);

      await expect(QuestionController.updateQuestion({ authorId, id, title, content })).resolves.toMatchObject({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return a success message if the question was updated successfully', async () => {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const authorId = faker.number.int();
      const id = faker.number.int();

      const question = {
        id,
        title,
        content,
        authorId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(updateQuestion).mockResolvedValueOnce(question);

      await expect(QuestionController.updateQuestion({ authorId, id, title, content })).resolves.toEqual({
        success: true,
        message: 'Successfully updated the question',
        data: {
          question,
        },
      });
    });
  });

  describe('delete Question', () => {
    it('should fail if the id is not an int', async () => {
      const id = faker.number.float();
      const authorId = faker.number.int();

      await expect(QuestionController.deleteQuestion({ id, authorId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if the question does not exist', async () => {
      const id = faker.number.int();
      const authorId = faker.number.int();

      mocked(findQuestion).mockResolvedValueOnce(null);

      await expect(QuestionController.deleteQuestion({ id, authorId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should fail if the user is not the author of the question', async () => {
      const id = faker.number.int();
      const authorId = faker.number.int();

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int(),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);

      await expect(QuestionController.deleteQuestion({ id, authorId })).resolves.toEqual({
        success: false,
        error: expect.any(String),
      });
    });

    it('should return a success message if the question was deleted successfully', async () => {
      const id = faker.number.int();
      const authorId = faker.number.int();

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(deleteAquestion).mockResolvedValueOnce(question);

      await expect(QuestionController.deleteQuestion({ id, authorId })).resolves.toMatchObject({
        success: true,
        message: 'Successfully deleted the question',
      });
    });
  });
});
