import prisma from '../utils/db.server'
import { Request, Response } from 'express'

class QuestionController {
  // GET: list of all questions
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

  // GET: list of all questions posted by a user
  static async listUserQuestions(req: Request, res: Response) {
    try {
      const authorId = Number(req.userId);
      const questions = await prisma.question.findMany({
        where: {
          authorId
        },
        orderBy: {
          id: 'asc',
        }
      });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved questions',
        // return specific fields from the question object
        data: {
          questions:
            questions.map((question) => ({
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

  // POST: create a new question
  static async createQuestion(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Please provide title and content',
        });
      }
      if (title.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Title must be at least 10 characters long',
        });
      }
      if (content.length < 20) {
        return res.status(400).json({
          success: false,
          error: 'Content must be at least 20 characters long',
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
      // const allUserQuestions = await this.listUserQuestions(req, res);
      res.status(201).json({
        success: true,
        message: 'Successfully created a new question',
        data: {
          question,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error creating the question',
      });
    }
  }
  // POST: update a question
  static async updateQuestion(req: Request, res: Response) { 
    try {
      const { id, title, content } = req.body;
      const question = await prisma.question.update({
        where: {
          id,
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
      res.status(200).json({
        success: true,
        message: 'Successfully updated question',
        data: question,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error updating the question',
        data: error.message,
      });
    }
  }

  // DELETE: delete a question
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

      res.status(200).json({
        success: true,
        message: 'Successfully deleted question',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        eror: 'There was an error deleting the question',
        data: error.message,
      });
    }
  }
}


export default QuestionController;