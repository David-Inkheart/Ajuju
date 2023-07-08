// main router for the app
import express from 'express';

import UserController from '../controllers/Usercontroller';
import VoteController from '../controllers/Votecontoller';
import authMiddleware from '../middleWares/authMiddleware';
import { changePasswordHandler, confirmResetPasswordHandler, loginHandler, registerHandler, resetPasswordHandler } from './routeHandlers/auth';
import {
  AllQuestionsHandler,
  AskedQuestionsHandler,
  createQuestionHandler,
  deleteQuestionHandler,
  updateQuestionHandler,
} from './routeHandlers/question';
import { createAnswerHandler, deleteAnswerHandler, listQuestionAnswersHandler, updateAnswerHandler } from './routeHandlers/answer';
import { getHomeHandler } from './routeHandlers/home';
import { followUserHandler, getFollowingHandler, searchAccountHandler, unfollowUserHandler } from './routeHandlers/user';

// instatiate router
const router = express.Router();

// get home page
router.get('/', getHomeHandler);
// POST: User registration
router.post('/auth/register', registerHandler);
// POST: User login
router.post('/auth/login', loginHandler);
// POST: Password reset request
router.post('/auth/reset-password', resetPasswordHandler);
// POST: Password reset confirmation
router.post('/auth/reset-password/confirm', confirmResetPasswordHandler);

// use auth middleware to protect the routes below
router.use(authMiddleware);

// POST: auth user change password
router.post('/auth/change-password', changePasswordHandler);
// GET: get profile of a user who owns the provided email
router.get('/search/accounts', searchAccountHandler);
// PUT: update user profile bio
router.put('/accounts/profile', UserController.updateProfile);
// GET: list of all questions
router.get('/allQuestions', AllQuestionsHandler);
router.get('/questions', AskedQuestionsHandler);
// GET: list of all answers to a question
router.get('/questions/:id/answers', listQuestionAnswersHandler);
// POST: follow a user
router.post('/accounts/follow/:id', followUserHandler);
// POST: unfollow a user
router.post('/accounts/unfollow/:id', unfollowUserHandler);
// POST: get all users a user is following
router.post('/accounts/following', getFollowingHandler);
// POST: get all users following a user
router.post('/accounts/followers', UserController.getFollowers);
// POST: create a new question
router.post('/questions', createQuestionHandler);
// POST: create a new answer to a question
router.post('/questions/:id/answers', createAnswerHandler);
// POST: upvote or downvote a question
router.post('/questions/:id/vote', VoteController.voteQuestion);
// POST: upvote or downvote an answer
router.post('/questions/:id/answers/:answerId/vote', VoteController.voteAnswer);
// PUT: update a question
router.put('/questions/:id', updateQuestionHandler);
// PUT: update an answer
router.put('/questions/:id/answers/:answerId', updateAnswerHandler);

// DELETE: delete a question
router.delete('/questions/:id', deleteQuestionHandler);
// DELETE: delete an answer
router.delete('/questions/:id/answers/:answerId', deleteAnswerHandler);

export default router;
