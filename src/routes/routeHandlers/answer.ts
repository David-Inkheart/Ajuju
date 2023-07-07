import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';

// import { UserId } from '../../types/custom';
import AnswerController from '../../controllers/Answercontroller';

export const listQuestionAnswersHandler: RequestHandler = async (req, res) => {
  try {
    const questionId = Number(req.params.id);

    const response = await AnswerController.listQuestionAnswers({ questionId });

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return res.status(404).json({
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
    });
  }
};

export const listUserAnswersHandler: RequestHandler = async (req, res) => {
  try {
    const authorId = Number(req.userId);

    const response = await AnswerController.listUserAnswers({ authorId });

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const createAnswerHandler: RequestHandler = async (req, res) => {
  try {
    const authorId = req.userId as UserId;
    const questionId = Number(req.params.id);
    const { content } = req.body;

    const response = await AnswerController.createAnswer({ authorId, questionId, content });

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.status(201).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateAnswerHandler: RequestHandler = async (req, res) => {
  try {
    const authorId = req.userId as UserId;
    const questionId = Number(req.params.id);
    const answerId = Number(req.params.answerId);
    const { content } = req.body;

    const response = await AnswerController.updateAnswer({
      authorId,
      questionId,
      answerId,
      content,
    });

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
    });
  }
};

export const deleteAnswerHandler: RequestHandler = async (req, res) => {
  try {
    const authorId = req.userId as UserId;
    const questionId = Number(req.params.id);
    const answerId = Number(req.params.answerId);

    const response = await AnswerController.deleteAnswer({
      authorId,
      questionId,
      answerId,
    });

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
    });
  }
};
