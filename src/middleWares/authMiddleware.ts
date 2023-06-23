import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwtErrorHandler } from './error-handlers';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {

    let token: string | undefined;

    // if (req.cookies && req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // check if token starts with Bearer
    if (req.headers.authorization && !req.headers.authorization.startsWith('Bearer')) {
      return res.status(401).json({
        success: false,
        error: "Authentication failed: token must start with 'Bearer'",
      });
    }

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed: Token not provided',
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Attach the user ID to the request for further use
    req.userId = decodedToken.userId;

    next();
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return jwtErrorHandler(err, req, res, next);
    }
    next(err);
  }
};

export default authMiddleware;
