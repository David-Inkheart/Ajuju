import prisma from '../utils/db.server'
import { Request, Response } from 'express'

class QuestionController {
  // GET: list of all questions
  static async listQuestions(req: Request, res: Response) {
    try {
    const questions = await prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        answer: {
          select: {
            author: true,
            content: true,
            createdAt: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            answer: true,
          },
        },
      },
    });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved list of all questions',
        data: questions,
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
      const authorId = Number(req.query.authorId || req.body.authorId);
      const questions = await prisma.question.findMany({
        where: {
          authorId
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              answer: true,
            },
          },
        },
      });
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved questions',
        data: questions,
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
      const { title, content, authorId } = req.body;
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
          // allUserQuestions,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error creating the question',
        data: error.message,
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
      const { id } = req.body;
      const question = await prisma.question.delete({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          content: true,
        },
      });
      res.status(200).json({
        success: true,
        message: 'Successfully deleted question',
        data: question,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'There was an error deleting the question',
        data: error.message,
      });
    }
  }
}


export default QuestionController;