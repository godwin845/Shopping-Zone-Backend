import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'dojgjawjhdjogjojw') as DecodedToken; // Type assertion
    req.user = decoded; // This will set `req.user` to the decoded token data
    next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
// explain this code in brief about why they are used and purposes