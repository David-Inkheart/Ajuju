//main router for the app
import express from 'express'

import AppController from '../controllers/Appcontroller'
import QuestionController from '../controllers/Questioncontroller'
import AuthController from '../controllers/Authcontroller'
import PasswordController from '../controllers/Passwordcontroller'
import UserController from '../controllers/Usercontroller'
import authMiddleware from '../middleWares/authMiddleware'

//instatiate router
const router = express.Router()

// get home page
router.get('/', AppController.getHome)
// GET: get profile of a user who owns the provided email
router.get('/search/accounts', authMiddleware, UserController.searchAccount)
// GET: list of all questions
router.get('/allQuestions', QuestionController.listQuestions)
router.get('/questions', QuestionController.listUserQuestions)

// POST: User registration
router.post('/auth/register', AuthController.register);
// POST: User login
router.post('/auth/login', AuthController.login);
// POST: User change password
router.post('/auth/change-password', authMiddleware, PasswordController.changePassword);
// POST: Password reset request
router.post('/auth/reset-password', authMiddleware, PasswordController.resetPassword);
// POST: Password reset confirmation
router.post('/auth/reset-password/confirm', authMiddleware, PasswordController.confirmResetPassword);
// POST: follow a user
router.post('/accounts/follow/:id', authMiddleware, UserController.followUser);
// POST: unfollow a user
router.post('/accounts/unfollow/:id', authMiddleware, UserController.unfollowUser);
// POST: create a new question
router.post('/questions', QuestionController.createQuestion)

// PUT: update a question
router.put('/questions/:id', QuestionController.updateQuestion)

// DELETE: delete a question
router.delete('/questions/:id', QuestionController.deleteQuestion)



export default router;