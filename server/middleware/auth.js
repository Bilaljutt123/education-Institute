// server/middleware/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Received Token:', token); // <-- ADD THIS LINE

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token Payload:', decoded); // <-- ADD THIS LINE

      // Fetch the full user from the database
      req.user = await User.findById(decoded.user.id).select('-password');
      console.log('User found in DB:', req.user); // <-- ADD THIS LINE

      if (!req.user) {
        return res.status(401).json({ msg: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message); // <-- CHANGE THIS LINE
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }

  if (!token) {
    console.log('No token found in headers'); // <-- ADD THIS LINE
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
};

export const admin = (req, res, next) => {
  console.log('Checking admin role for user:', req.user); // <-- ADD THIS LINE
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admin role required.' });
  }
};