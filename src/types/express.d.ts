import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string }; // Modify as per your token structure
    }
  }
}