import express from 'express';
import { addOrUpdateGPA, getStudentGPA, getAllGPAs } from '../controllers/gpaController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, addOrUpdateGPA)
  .get(protect, admin, getAllGPAs);

router.route('/student/:studentId')
  .get(protect, getStudentGPA);

export default router;
