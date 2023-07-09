import { Request, Response } from 'express';
import { VoteType } from '@prisma/client';
import prisma from '../utils/db.server';
import { voteQuestionSchema, voteAnswerSchema } from '../utils/validators';
import { findQuestion } from '../repositories/db.question';
import {
  changeQuestionVoteCount,
  createQuestionVote,
  deleteQuestionVote,
  updateQuestionVote,
  updateVoteCount,
  updateVoteCount2,
  userQuestionVote,
} from '../repositories/db.vote';

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

  static async voteAnswer(req: Request, res: Response) {
    const { id, answerId } = req.params;
    const { voteType } = req.body;
    const { userId } = req;

    try {
      // validate request body
      const { error } = voteAnswerSchema.validate({
        id,
        answerId,
        voteType,
      });

      if (error) {
        return res.status(400).json({
          status: 'error',
          error: error.message,
        });
      }
      // check if question exists
      const question = await prisma.question.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!question) {
        return res.status(404).json({
          status: 'error',
          error: 'Question not found',
        });
      }

      // check if answer exists
      const answer = await prisma.answer.findUnique({
        where: {
          id: Number(answerId),
        },
      });

      if (!answer) {
        return res.status(404).json({
          status: 'error',
          error: 'Answer not found',
        });
      }

      // check if user has voted before
      const vote = await prisma.answerVote.findFirst({
        where: {
          answerId: Number(answerId),
          userId,
        },
      });

      // console.log(vote);

      if (vote) {
        // check vote type
        if (vote.voteType === voteType) {
          // if vote type is the same as the one provided, remove vote
          await prisma.answerVote.delete({
            where: {
              id: vote.id,
            },
          });

          // delete vote from vote count
          await prisma.answer.update({
            where: {
              id: Number(answerId),
            },
            data: {
              voteCount: {
                increment: voteType === 'UPVOTE' ? -1 : 1,
              },
            },
          });
          // console.log(answer.voteCount);

          return res.status(200).json({
            status: 'success',
            message: 'Vote removed successfully',
          });
        }

        // if vote type is different from the one provided, update vote
        await prisma.answerVote.update({
          where: {
            id: vote.id,
          },
          data: {
            voteType,
          },
        });

        // update vote count
        await prisma.answer.update({
          where: {
            id: Number(answerId),
          },
          data: {
            voteCount: {
              increment: voteType === 'UPVOTE' ? 2 : -2,
            },
          },
        });

        return res.status(200).json({
          status: 'success',
          message: `vote changed to ${voteType} successfully`,
        });
      }
      // if user has not voted before, create vote
      await prisma.answerVote.create({
        data: {
          voteType,
          answer: {
            connect: {
              id: Number(answerId),
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // update vote count
      await prisma.answer.update({
        where: {
          id: Number(answerId),
        },
        data: {
          voteCount: {
            increment: voteType === 'UPVOTE' ? 1 : -1,
          },
        },
      });

      return res.status(201).json({
        status: 'success',
        message: `${voteType}D successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: 'your vote could not be processed at this time',
      });
    }
  }
}

export default VoteController;
