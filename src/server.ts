import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';


import router from './routes/index';

const app = express();

const Port = process.env.PORT || 3000;

// middlewares
app.use(cors())
app.use(express.json())


// ... REST API routes will go here
app.use('/', router);
// app.use('/allQuestions', router);
// app.use('/questions', router);

// Not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

// Error Handling to catch any unhandled error during req processing
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});


app.listen(Port, () => {
  console.log(`REST API server is running on http://localhost:${Port}`)
})

export default app;