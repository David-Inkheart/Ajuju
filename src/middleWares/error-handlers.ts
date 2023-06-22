
// custom error handler that returns a JSON response

// usage: throw new BadRequestError();
// should be used in proper JsontResponse format
// example:
// throw new BadRequestError('Invalid email or password');
// throw new BadRequestError('Invalid email or password', { email: 'Email is required' });
// throw new BadRequestError({ email: 'Email is required' });

import { Request, Response, NextFunction } from 'express';

class CustomError extends Error {
  statusCode: number;
  data: any;
  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'Bad request', data = {}) {
    super(message, 400, data);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized', data = {}) {
    super(message, 401, data);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden', data = {}) {
    super(message, 403, data);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Not found', data = {}) {
    super(message, 404, data);
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Internal server error', data = {}) {
    super(message, 500, data);
  }
}

// jwt error handler
const jwtErrorHandler = (err: any) => {
  const message = err.message;
  const statusCode = 401;
  const data = {};
  return {
    message,
    statusCode,
    data,
  };
};


// how to use the error handler
// import { errorHandler } from './utils/error-handlers';
// app.use(errorHandler);
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message, data } = err;
  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
}

export {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  errorHandler,
  jwtErrorHandler
};
