import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';
import { VoteType } from '@prisma/client';

import VoteController from './Votecontroller';
import { findQuestion } from '../repositories/db.question';
import { deleteQuestionVote, updateVoteCount, userQuestionVote, createQuestionVote, changeQuestionVoteCount } from '../repositories/db.vote';

jest.mock('../repositories/db.question');
jest.mock('../repositories/db.vote');
// jest.mock('@prisma/client');

describe('Vote Controller', () => {
  describe('voteQuestion', () => {
    it('should fail if validation fails', async () => {
      const id = faker.number.float();
      const userId = faker.number.int({ max: 999999999 });
      const voteType = ['UPVOTE', 'DOWNVOTE'] as unknown as VoteType;
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
});
