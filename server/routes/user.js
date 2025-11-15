// routes/user.js

import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js'; // We'll also need the admin middleware
import { protect, admin } from '../middleware/auth.js'; // Make sure to import admin

// @desc    Get logged-in user's data
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
    msg: 'You have accessed a protected route!',
  });
});

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private (Admin only)
router.get('/students', protect, admin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password'); // Find all users with the role 'student' and exclude their password

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;