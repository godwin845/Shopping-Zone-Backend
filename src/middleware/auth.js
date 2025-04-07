import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'dojgjawjhdjogjojw');
    req.user = decoded; // Set decoded data to `req.user`
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};