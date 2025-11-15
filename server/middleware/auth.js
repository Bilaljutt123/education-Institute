// middleware/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // <-- 1. IMPORT THE USER MODEL

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. FETCH THE FULL USER FROM THE DATABASE
      // The decoded token contains the user's ID. We use it to find the user.
      // .select('-password') ensures the password field is not returned.
      req.user = await User.findById(decoded.user.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ msg: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
};

export const admin = (req, res, next) => {
  // This will now work correctly because req.user contains the full user object
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admin role required.' });
  }
};