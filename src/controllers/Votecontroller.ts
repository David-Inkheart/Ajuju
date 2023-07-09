import { VoteType } from '@prisma/client';
import { voteQuestionSchema, voteAnswerSchema } from '../utils/validators';
import { findQuestion } from '../repositories/db.question';
import {
  changeAnswerVoteCount,
  changeQuestionVoteCount,
  createAnswerVote,
  createQuestionVote,
  deleteAnswerVote,
  deleteQuestionVote,
  updateAnswerVote,
  updateAnswerVoteCount,
  updateAnswerVoteCount2,
  updateQuestionVote,
  updateVoteCount,
  updateVoteCount2,
  userAnswerVote,
  userQuestionVote,
} from '../repositories/db.vote';
import { findAnswer } from '../repositories/db.answer';

class VoteController {
  static async voteQuestion({ userId, id, voteType }: { userId: number; id: number; voteType: VoteType }) {
    const { error } = voteQuestionSchema.validate({
      id,
      voteType,
    });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    const question = await findQuestion(id);
    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }
    // check if user has voted before
    const vote = await userQuestionVote(userId, Number(id));
    if (vote) {
      if (vote.voteType === voteType) {
        await deleteQuestionVote(vote.id);
        // update vote count by increasing or decreasing by 1
        await updateVoteCount(Number(id), voteType);
        return {
          success: true,
          message: 'Vote removed successfully',
        };
      }
      // if vote type is different from the one provided, update vote
      await updateQuestionVote(vote.id, voteType);
      // update vote count by increasing or decreasing by 2
      await updateVoteCount2(Number(id), voteType);
      return {
        success: true,
        message: `vote changed to ${voteType} successfully`,
      };
    }
    // if user has not voted before, create vote
    await createQuestionVote(userId, Number(id), voteType);
    // change vote count by increasing or decreasing by 1
    await changeQuestionVoteCount(Number(id), voteType);

    return {
      success: true,
      message: `${voteType}D successfully`,
    };
  }

  static async voteAnswer({ userId, id, answerId, voteType }: { userId: number; id: number; answerId: number; voteType: VoteType }) {
    const { error } = voteAnswerSchema.validate({
      id,
      answerId,
      voteType,
    });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // check if question exists
    const question = await findQuestion(id);
    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }
    // check if answer exists or belongs to question
    const answer = await findAnswer(answerId);
    if (!answer || answer.questionId !== id) {
      return {
        success: false,
        error: 'Answer not found',
      };
    }
    // check if user has voted before
    const vote = await userAnswerVote(userId, answerId);
    if (vote) {
      if (vote.voteType === voteType) {
        await deleteAnswerVote(vote.id);
        // update vote count by increasing or decreasing by 1
        await updateAnswerVoteCount(answerId, voteType);
        return {
          success: true,
          message: 'Vote removed successfully',
        };
      }
      // if vote type is different from the one provided, update vote
      await updateAnswerVote(vote.id, voteType);
      // update vote count by increasing or decreasing by 2
      await updateAnswerVoteCount2(answerId, voteType);

      return {
        success: true,
        message: `vote changed to ${voteType} successfully`,
      };
    }
    // if user has not voted before, create vote
    await createAnswerVote(userId, answerId, voteType);

    // update vote count
    await changeAnswerVoteCount(answerId, voteType);

    return {
      success: true,
      message: `${voteType}D successfully`,
    };
  }
}

export default VoteController;
