import jwt, { JwtPayload } from 'jsonwebtoken';
     import { Request, Response, NextFunction } from 'express';

     const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
       try {
         // Get the token from the request header
         const token = req.headers.authorization?.split(' ')[1];

         if (!token) {
           return res.status(401).json({
             success: false,
             message: 'Authentication failed: Token not provided',
           });
         }

         // Verify the token
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

         // Attach the user ID to the request for further use
         req.userId = decodedToken.userId;

         // Continue to the next middleware or route handler
         next();
       } catch (error) {
         return res.status(401).json({
           success: false,
           message: 'Authentication failed: Invalid token',
         });
       }
     }

     export default authMiddleware;