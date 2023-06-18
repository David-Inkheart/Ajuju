//main router for the app
import express from 'express'

import AppController from '../controllers/Appcontroller'
import QuestionController from '../controllers/Questioncontroller'
import AuthController from '../controllers/Authcontroller'

//instatiate router
const router = express.Router()

// get home page
router.get('/', AppController.getHome)

// POST: User registration
router.post('/auth/register', AuthController.register);
// POST: User login
router.post('/auth/login', AuthController.login);
// POST: create a new question
router.post('/questions', QuestionController.createQuestion)

// GET: list of all questions
router.get('/allQuestions', QuestionController.listQuestions)
router.get('/questions', QuestionController.listUserQuestions)

// PUT: update a question
router.put('/questions/:id', QuestionController.updateQuestion)

// DELETE: delete a question
router.delete('/questions/:id', QuestionController.deleteQuestion)



export default router;