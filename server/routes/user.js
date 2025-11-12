// routes/user.js

import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js'; // Import our middleware

// @desc    Get logged-in user's data
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, (req, res) => {
  // The 'protect' middleware will run first and add req.user
  res.status(200).json({
    success: true,
    data: req.user, // Send back the user data from the token
    msg: 'You have accessed a protected route!',
  });
});

export default router;