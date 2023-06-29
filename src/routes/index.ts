// main router for the app
import express from 'express';

import AppController from '../controllers/Appcontroller';
import QuestionController from '../controllers/Questioncontroller';
import AuthController from '../controllers/Authcontroller';
import PasswordController from '../controllers/Passwordcontroller';
import UserController from '../controllers/Usercontroller';
import AnswerController from '../controllers/Answercontroller';
import authMiddleware from '../middleWares/authMiddleware';

// instatiate router
const router = express.Router();

// get home page
router.get('/', AppController.getHome);
// POST: User registration
router.post('/auth/register', AuthController.register);
// POST: User login
router.post('/auth/login', AuthController.login);
// POST: Password reset request
router.post('/auth/reset-password', PasswordController.resetPassword);
// POST: Password reset confirmation
router.post('/auth/reset-password/confirm', PasswordController.confirmResetPassword);

// use auth middleware to protect the routes below
router.use(authMiddleware);

// POST: auth user change password
router.post('/auth/change-password', PasswordController.changePassword);
// GET: get profile of a user who owns the provided email
router.get('/search/accounts', UserController.searchAccount);
// GET: list of all questions
router.get('/allQuestions', QuestionController.listQuestions);
router.get('/questions', QuestionController.listUserQuestions);
// GET: list of all answers to a question
router.get('/questions/:id/answers', AnswerController.listQuestionAnswers);
// POST: follow a user
router.post('/accounts/follow/:id', UserController.followUser);
// POST: unfollow a user
router.post('/accounts/unfollow/:id', UserController.unfollowUser);
// POST: get all users a user is following
router.post('/accounts/following', UserController.getFollowing);
// POST: get all users following a user
router.post('/accounts/followers', UserController.getFollowers);
// POST: create a new question
router.post('/questions', QuestionController.createQuestion);
// POST: create a new answer to a question
router.post('/questions/:id/answers', AnswerController.createAnswer);

// PUT: update a question
router.put('/questions/:id', QuestionController.updateQuestion);

// DELETE: delete a question
router.delete('/questions/:id', QuestionController.deleteQuestion);
// DELETE: delete an answer
router.delete('/questions/:id/answers/:answerId', AnswerController.deleteAnswer);

export default router;
