// routes/user.js

import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

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
    const students = await User.find({ role: 'student' }).select('-password');

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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      phone,
      dateOfBirth,
      address,
      previousEducation,
      emergencyContact,
    } = req.body;

    // Find user and update profile fields
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) user.address = address;
    if (previousEducation) user.previousEducation = previousEducation;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    // Mark profile as completed if all required fields are filled
    const requiredFieldsFilled = user.phone && user.dateOfBirth && user.previousEducation;
    user.profileCompleted = !!requiredFieldsFilled;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      msg: 'Profile updated successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;