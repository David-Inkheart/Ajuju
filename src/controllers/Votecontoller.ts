import { Request, Response } from 'express';
import prisma from '../utils/db.server';
import { voteQuestionSchema } from '../utils/validators';

class VoteController {
  static async voteQuestion(req: Request, res: Response) {
    const { id } = req.params;
    const { voteType } = req.body;
    const { userId } = req;

    try {
      // validate request body
      const { error } = voteQuestionSchema.validate({
        id,
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

      // check if user has voted before
      const vote = await prisma.questionVote.findFirst({
        where: {
          questionId: Number(id),
          userId,
        },
      });

      // console.log(vote);

      if (vote) {
        // check vote type
        if (vote.voteType === voteType) {
          // if vote type is the same as the one provided, remove vote
          await prisma.questionVote.delete({
            where: {
              id: vote.id,
            },
          });

          // delete vote from vote count
          await prisma.question.update({
            where: {
              id: Number(id),
            },
            data: {
              voteCount: {
                increment: voteType === 'UPVOTE' ? -1 : 1,
              },
            },
          });
          // console.log(question.voteCount);

          return res.status(200).json({
            status: 'success',
            message: 'Vote removed successfully',
          });
        }

        // if vote type is different from the one provided, update vote
        await prisma.questionVote.update({
          where: {
            id: vote.id,
          },
          data: {
            voteType,
          },
        });

        // update vote count
        await prisma.question.update({
          where: {
            id: Number(id),
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
      await prisma.questionVote.create({
        data: {
          voteType,
          question: {
            connect: {
              id: Number(id),
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
      await prisma.question.update({
        where: {
          id: Number(id),
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
