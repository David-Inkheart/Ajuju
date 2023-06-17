import express from 'express'
import cors from 'cors'

import router from './routes/index'

const app = express()

const Port = process.env.PORT || 3000

// middlewares
app.use(cors())
app.use(express.json())

// ... REST API routes will go here
app.use('/', router);
app.use('/allQuestions', router);
app.use('/questions', router);

// app.get('/questions', async (req, res) => { 
//   const questions = await prisma.question.findMany()
//   res.json(questions)
// })

app.listen(Port, () => {
  console.log(`REST API server is running on http://localhost:${Port}`)
})

export default app