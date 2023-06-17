import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Port = process.env.PORT || 3000

const app = express()

app.use(express.json())

// ... REST API routes will go here
app.get('/', (req, res) => {
  res.json({ message: 'Ajuju: Your instant answer hub!' })
})

app.get('/questions', async (req, res) => { 
  const questions = await prisma.question.findMany()
  res.json(questions)
})

app.listen(Port, () => {
  console.log(`REST API server is running on http://localhost:${Port}`)
})
