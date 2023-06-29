import prisma from '../utils/db.server'
import { Request, Response } from 'express'
import { answerSchema } from '../utils/validators';

class AnswerController {
  // GET: list of all answers to a question
  static async listQuestionAnswers(req: Request, res: Response) {
    try {
      const questionId = Number(req.params.id);
      const answers = await prisma.answer.findMany({
        where: {
          questionId
        },
        orderBy: {
          id: 'asc',
        }
      });

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

      res.status(200).json({
        success: true,
        message: 'Successfully retrieved answers',
        // return specific fields from the answer object
        data: {
          question: {
            id: question.id,
            title: question.title,
            content: question.content,
          },
          answers:
            answers.map((answer) => ({
              id: answer.id,
              content: answer.content,
            })),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error fetching the data',
        data: error.message,
      });
    }
  }

  // GET: list of all answers posted by a user
  static async listUserAnswers(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const answers = await prisma.answer.findMany({
        where: {
          authorId
        },
        orderBy: {
          id: 'asc',
        }
      });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved answers',
        // return specific fields from the answer object
        data: {
          answers:
            answers.map((answer) => ({
              id: answer.id,
              content: answer.content,
            })),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error fetching the data',
        data: error.message,
      });
    }
  }
  // POST: create a new answer to a question
  static async createAnswer(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const { content } = req.body;

      // validate user input
      const { error } = answerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      const questionId = Number(req.params.id);
      if (!questionId) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a question id',
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
      res.status(201).json({
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
      res.status(500).json({
        success: false,
        message: 'There was an error answering the question',
        data: error.message,
      });
    }
  }

  // PUT: update an answer
  static async updateAnswer(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const { content } = req.body;

      // validate user input
      const { error } = answerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
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

      res.status(200).json({
        success: true,
        message: 'Successfully updated answer',
        data: answer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error updating the answer',
        data: error.message,
      });
    }
  }

  // DELETE: delete an answer if the user is the author
  static async deleteAnswer(req: Request, res: Response) {
    try {
      const userId = Number(req.userId);
      const questionId = Number(req.params.id);
      const answerId = Number(req.params.answerId);
      // console.log(userId, questionId, answerId);
      // check if the question exists
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
      res.status(200).json({
        success: true,
        message: 'Successfully deleted answer',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error deleting the answer',
      });
    }
  }
}

export default AnswerController;