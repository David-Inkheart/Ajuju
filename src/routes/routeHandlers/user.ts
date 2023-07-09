import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';

import UserController from '../../controllers/Usercontroller';

export const searchAccountHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email as string;

    const response = await UserController.searchAccount({ email });

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

export const followUserHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;
    const id = Number(req.params.id);

    const response = await UserController.followUser({ userId, id });

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
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const unfollowUserHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;
    const id = Number(req.params.id);

    const response = await UserController.unfollowUser({ userId, id });

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
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getFollowingHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;

    const response = await UserController.getFollowing({ userId });

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

export const getFollowersHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;

    const response = await UserController.getFollowers({ userId });

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

export const updateProfileHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;
    const { bio } = req.body;

    const response = await UserController.updateProfile({ userId, bio });

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
    });
  }
};
