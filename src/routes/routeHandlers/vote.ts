import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';

import VoteController from '../../controllers/Votecontroller';

export const voteQuestionHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.userId as UserId;

    const vote = await VoteController.voteQuestion({
      id: Number(id),
      userId,
      voteType,
    });

    if (!vote.success) {
      return res.status(400).json({
        success: vote.success,
        error: vote.error,
      });
    }

    return res.json({
      success: vote.success,
      message: vote.message,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
