// routes/course.js

import express from 'express';
const router = express.Router();
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, admin } from '../middleware/auth.js';

// Routes for viewing courses (can be public)
router.route('/').get(getCourses);
router.route('/:id').get(getCourseById);

// Routes for creating, updating, and deleting courses (admin only)
router.route('/').post(protect, admin, createCourse);
router.route('/:id').put(protect, admin, updateCourse).delete(protect, admin, deleteCourse);

export default router;