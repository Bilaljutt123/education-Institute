// middleware/auth.js

import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in the 'Authorization' header
  // The header should be in the format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach user payload to the request object
      // In a real app, you might fetch the full user from the DB here
      // For now, we just attach the user ID from the token
      req.user = decoded.user;

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }

  // 5. If no token is found
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
};