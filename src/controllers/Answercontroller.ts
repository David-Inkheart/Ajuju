import { Request, Response } from 'express';
import prisma from '../utils/db.server';
import { answerSchema, idSchema } from '../utils/validators';

class AnswerController {
  // list of all answers to a question
  static async listQuestionAnswers(req: Request, res: Response) {
    try {
      const questionId = Number(req.params.id);

      const { error } = idSchema.validate(questionId);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const question = await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found',
        });
      }

      const answers = await prisma.answer.findMany({
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

      return res.status(200).json({
        success: true,
        message: 'Successfully retrieved answers',
        // return specific fields from the answer object
        data: {
          question: {
            id: question.id,
            title: question.title,
            content: question.content,
          },
          answers: answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            voteCount: answer.voteCount,
          })),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'There was an error fetching the data',
        data: error.message,
      });
    }
  }

  // list of all answers posted by a user
  static async listUserAnswers(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const answers = await prisma.answer.findMany({
        where: {
          authorId,
        },
        orderBy: {
          id: 'asc',
        },
      });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved answers',
        // return specific fields from the answer object
        data: {
          answers: answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
          })),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'There was an error fetching the data',
      });
    }
  }

  // create a new answer to a question
  static async createAnswer(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const { content } = req.body;

      // validate user input
      const { error } = answerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const questionId = Number(req.params.id);

      // validate question id
      const { error: idError } = idSchema.validate(questionId);

      if (idError) {
        return res.status(400).json({
          success: false,
          error: idError.message,
        });
      }

      // get the question
      const question = await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found',
        });
      }

      const answer = await prisma.answer.create({
        data: {
          content,
          authorId,
          questionId,
        },
      });
      return res.status(201).json({
        success: true,
        message: 'Successfully answered the question',
        data: {
          question: {
            title: question.title,
            content: question.content,
          },
          answer: {
            id: answer.id,
            answer: answer.content,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'There was an error answering the question',
      });
    }
  }

  // update an answer
  static async updateAnswer(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const { content } = req.body;

      // validate user input
      const { error } = answerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const questionId = Number(req.params.id);

      // validate question id
      const { error: idError } = idSchema.validate(questionId);

      if (idError) {
        return res.status(400).json({
          success: false,
          error: idError.message,
        });
      }

      const answerId = Number(req.params.id);

      // check if the the user is the author
      const answer = await prisma.answer.findUnique({
        where: {
          id: answerId,
        },
      });
      if (!answer) {
        return res.status(404).json({
          success: false,
          error: 'Answer not found',
        });
      }

      if (answer.authorId !== authorId) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to update this answer',
        });
      }

      // update the answer
      await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          content,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully updated answer',
        data: answer,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'There was an error updating the answer',
        data: error.message,
      });
    }
  }

  // delete an answer if the user is the author
  static async deleteAnswer(req: Request, res: Response) {
    try {
      const userId = Number(req.userId);
      const questionId = Number(req.params.id);
      const answerId = Number(req.params.answerId);
      // validate question id
      const { error } = idSchema.validate(questionId);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      // validate answer id
      const { error: answerError } = idSchema.validate(answerId);

      if (answerError) {
        return res.status(400).json({
          success: false,
          error: answerError.message,
        });
      }

      const question = await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found',
        });
      }
      const answer = await prisma.answer.findUnique({
        where: {
          id: answerId,
        },
      });
      if (!answer) {
        return res.status(404).json({
          success: false,
          error: 'Answer not found',
        });
      }
      // console.log(answer.authorId, userId);
      if (answer.authorId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to delete this answer',
        });
      }
      // check if the question has the answer
      const questionAnswer = await prisma.question.findFirst({
        where: {
          id: questionId,
          answer: {
            some: {
              id: answerId,
            },
          },
        },
      });
      if (!questionAnswer) {
        return res.status(404).json({
          success: false,
          error: 'Answer not found',
        });
      }
      // delete the answer
      await prisma.answer.delete({
        where: {
          id: answerId,
        },
      });
      return res.status(200).json({
        success: true,
        message: 'Successfully deleted answer',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'There was an error deleting the answer',
      });
    }
  }
}

export default AnswerController;
