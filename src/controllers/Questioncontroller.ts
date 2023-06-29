import { Request, Response } from 'express';
import prisma from '../utils/db.server';
import { questionSchema } from '../utils/validators';

class QuestionController {
  static async listQuestions(req: Request, res: Response) {
    try {
      const questions = await prisma.question.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved list of all questions',
        data: questions.map((question) => ({
          id: question.id,
          title: question.title,
          content: question.content,
          authorId: question.authorId,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error fetching the data',
        data: error.message,
      });
    }
  }

  static async listUserQuestions(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const questions = await prisma.question.findMany({
        where: {
          authorId,
        },
        orderBy: {
          id: 'asc',
        },
      });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved questions',
        // return specific fields from the question object
        data: {
          questions: questions.map((question) => ({
            id: question.id,
            title: question.title,
            content: question.content,
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

  static async createQuestion(req: Request, res: Response) {
    try {
      const { title, content } = req.body;

      // validate the request body
      const { error } = questionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const authorId = Number(req.userId);
      const question = await prisma.question.create({
        data: {
          title,
          content,
          authorId,
        },
        select: {
          id: true,
          title: true,
          content: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Successfully created a new question',
        data: {
          question,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'There was an error creating the question',
      });
    }
  }

  static async updateQuestion(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      // validate the request body
      const { error } = questionSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const { id } = req.params;
      const authorId = Number(req.userId);

      const question = await prisma.question.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found',
        });
      }

      if (question.authorId !== authorId) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to update this question',
        });
      }

      const updatedQuestion = await prisma.question.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          content,
        },
        select: {
          id: true,
          title: true,
          content: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully updated question',
        data: {
          question: updatedQuestion,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'There was an error updating the question',
        data: error.message,
      });
    }
  }

  static async deleteQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authorId = Number(req.userId);
      const question = await prisma.question.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found',
        });
      }

      if (question.authorId !== authorId) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to delete this question',
        });
      }
      // console.log(question.authorId, authorId);
      await prisma.question.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully deleted question',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        eror: 'There was an error deleting the question',
        data: error.message,
      });
    }
  }
}

export default QuestionController;
