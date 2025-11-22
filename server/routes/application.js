// routes/application.js

import express from 'express';
const router = express.Router();
// 1. Import the new getMyApplication function
import { submitApplication, getApplications, updateApplicationStatus, getMyApplication } from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js';

// 2. Add the new route for getting the logged-in user's own application
// This route must come before /:id, otherwise Express will treat 'me' as an ID
router.get('/me', protect, getMyApplication);

// Route for getting ALL applications for the logged-in student
router.get('/my-applications', protect, getMyApplication);

// Route for submitting an application (only for logged-in students)
router.post('/', protect, submitApplication);

// Routes for viewing and updating applications (for admins only)
router.get('/', protect, admin, getApplications);
router.put('/:id', protect, admin, updateApplicationStatus);

export default router;