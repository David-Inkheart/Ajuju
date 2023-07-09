import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';
import { VoteType } from '@prisma/client';

import VoteController from './Votecontroller';
import { findQuestion } from '../repositories/db.question';
import { findAnswer } from '../repositories/db.answer';
import {
  deleteQuestionVote,
  updateVoteCount,
  userQuestionVote,
  createQuestionVote,
  changeQuestionVoteCount,
  changeAnswerVoteCount,
  createAnswerVote,
  deleteAnswerVote,
  updateAnswerVote,
  updateAnswerVoteCount,
  updateAnswerVoteCount2,
  userAnswerVote,
} from '../repositories/db.vote';

jest.mock('../repositories/db.question');
jest.mock('../repositories/db.vote');
jest.mock('../repositories/db.answer');

describe('Vote Controller', () => {
  describe('voteQuestion', () => {
    it('should fail if validation fails', async () => {
      const id = faker.number.float();
      const userId = faker.number.int({ max: 999999999 });
      const voteType = 'UPVOTE' as VoteType;
      await expect(
        VoteController.voteQuestion({
          id,
          userId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if question does not exist', async () => {
      const id = faker.number.float();
      const userId = faker.number.int({ max: 999999999 });
      const voteType = ['UPVOTE', 'DOWNVOTE'] as unknown as VoteType;

      mocked(findQuestion).mockResolvedValueOnce(null);

      await expect(
        VoteController.voteQuestion({
          id,
          userId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should delete vote if user has voted with same type before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(userQuestionVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        questionId: id,
        voteType,
        createdAt: faker.date.anytime(),
      });
      mocked(deleteQuestionVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        questionId: id,
        voteType,
        createdAt: faker.date.past(),
      });
      await expect(
        VoteController.voteQuestion({
          id,
          userId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: 'Vote removed successfully',
      });
    });

    it('should update vote if user has voted with different type before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(userQuestionVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        questionId: id,
        voteType: 'DOWNVOTE' as VoteType,
        createdAt: faker.date.anytime(),
      });
      mocked(updateVoteCount).mockResolvedValueOnce(question);
      await expect(
        VoteController.voteQuestion({
          id,
          userId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: `vote changed to ${voteType} successfully`,
      });
    });

    it('should create vote if user has not voted before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(userQuestionVote).mockResolvedValueOnce(null);
      mocked(createQuestionVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        questionId: id,
        voteType,
        createdAt: faker.date.past(),
      });
      mocked(changeQuestionVoteCount).mockResolvedValueOnce(question);
      await expect(
        VoteController.voteQuestion({
          id,
          userId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: `${voteType}D successfully`,
      });
    });
  });

  describe('voteAnswer', () => {
    it('should fail if validation fails', async () => {
      const id = faker.number.float();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.float();
      const voteType = 'UPVOTE' as unknown as VoteType;
      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if question does not exist', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      mocked(findQuestion).mockResolvedValueOnce(null);

      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: false,
        error: 'Question not found',
      });
    });

    it('should fail if answer does not exist', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(findAnswer).mockResolvedValueOnce(null);

      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: false,
        error: 'Answer not found',
      });
    });

    it('should delete vote if user has voted with same type before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      const answer = {
        id: answerId,
        questionId: id,
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answerVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(findAnswer).mockResolvedValueOnce(answer);
      mocked(userAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType,
        createdAt: faker.date.anytime(),
      });
      mocked(deleteAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType,
        createdAt: faker.date.past(),
      });
      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: 'Vote removed successfully',
      });
    });

    it('should update vote if user has voted with different type before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      const answer = {
        id: answerId,
        questionId: id,
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answerVote: [
          {
            id: faker.number.int(),
            userId,
            answerId,
            voteType: 'DOWNVOTE' as VoteType,
            createdAt: faker.date.anytime(),
          },
        ],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(findAnswer).mockResolvedValueOnce(answer);
      mocked(userAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType: 'DOWNVOTE' as VoteType,
        createdAt: faker.date.anytime(),
      });
      mocked(updateAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType,
        createdAt: faker.date.anytime(),
      });
      mocked(updateAnswerVoteCount).mockResolvedValueOnce(answer);
      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: `vote changed to ${voteType} successfully`,
      });
    });

    it('should create vote if user has not voted before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      const answer = {
        id: answerId,
        questionId: id,
        content: faker.lorem.paragraph(),
        authorId: faker.number.int({ max: 999999999 }),
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answerVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(findAnswer).mockResolvedValueOnce(answer);
      mocked(userAnswerVote).mockResolvedValueOnce(null);
      mocked(createAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType,
        createdAt: faker.date.past(),
      });
      mocked(changeAnswerVoteCount).mockResolvedValueOnce(answer);
      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: `${voteType}D successfully`,
      });
    });

    it('should update vote count by 1 if user has not voted before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: userId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      const answer = {
        id: answerId,
        questionId: id,
        content: faker.lorem.paragraph(),
        authorId: userId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answerVote: [],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(findAnswer).mockResolvedValueOnce(answer);
      mocked(userAnswerVote).mockResolvedValueOnce(null);
      mocked(createAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType,
        createdAt: faker.date.past(),
      });
      mocked(changeAnswerVoteCount).mockResolvedValueOnce(answer);
      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: `${voteType}D successfully`,
      });
    });

    it('should update vote count by 2 if user has voted with different type before', async () => {
      const id = faker.number.int();
      const userId = faker.number.int({ max: 999999999 });
      const answerId = faker.number.int();
      const voteType = 'UPVOTE' as VoteType;

      const question = {
        id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: userId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answer: [],
        questionVote: [],
      };

      const answer = {
        id: answerId,
        questionId: id,
        content: faker.lorem.paragraph(),
        authorId: userId,
        voteCount: faker.number.int(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        answerVote: [
          {
            id: faker.number.int(),
            userId,
            answerId,
            voteType: 'DOWNVOTE' as VoteType,
            createdAt: faker.date.anytime(),
          },
        ],
      };

      mocked(findQuestion).mockResolvedValueOnce(question);
      mocked(findAnswer).mockResolvedValueOnce(answer);
      mocked(userAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType: 'DOWNVOTE' as VoteType,
        createdAt: faker.date.anytime(),
      });
      mocked(updateAnswerVote).mockResolvedValueOnce({
        id: faker.number.int(),
        userId,
        answerId,
        voteType,
        createdAt: faker.date.anytime(),
      });
      mocked(updateAnswerVoteCount2).mockResolvedValueOnce(answer);
      await expect(
        VoteController.voteAnswer({
          id,
          userId,
          answerId,
          voteType,
        }),
      ).resolves.toMatchObject({
        success: true,
        message: `vote changed to ${voteType} successfully`,
      });
    });
  });
});
