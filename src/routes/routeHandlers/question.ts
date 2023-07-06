import { RequestHandler } from 'express';

import { UserId } from '../../types/custom';
import QuestionController from '../../controllers/Questioncontroller';

export const AllQuestionsHandler: RequestHandler = async (req, res) => {
  try {
    const questions = await QuestionController.listQuestions();

    return res.json({
      success: true,
      message: 'Questions retrieved successfully',
      data: questions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'There was an error retrieving the questions',
      data: error.message,
    });
  }
};

export const AskedQuestionsHandler: RequestHandler = async (req, res) => {
  try {
    const authorId = req.userId as UserId;

    const questions = await QuestionController.listUserQuestions(authorId);

    return res.json({
      success: true,
      message: 'Questions retrieved successfully',
      data: questions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'There was an error retrieving the questions',
      data: error.message,
    });
  }
};

export const createQuestionHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;

    const authorId = req.userId as UserId;

    const response = await QuestionController.createQuestion(title, content, authorId);

    if (!response.success) {
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      data: error.message,
    });
  }
};

export const updateQuestionHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = Number(req.params.id);
    const authorId = req.userId as UserId;

    const response = await QuestionController.updateQuestion({ id, title, content, authorId });

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: response.error,
        });
      }
      if (response.error?.includes('not authorized')) {
        return res.status(403).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      data: error.message,
    });
  }
};

export const deleteQuestionHandler: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const authorId = req.userId as UserId;

    const response = await QuestionController.deleteQuestion({ id, authorId });

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: response.error,
        });
      }
      if (response.error?.includes('not authorized')) {
        return res.status(403).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      data: error.message,
    });
  }
};
