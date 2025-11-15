// routes/application.js

import express from 'express';
const router = express.Router();
import { submitApplication, getApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js'; // <-- Import 'admin'

// Route for submitting an application (only for logged-in students)
router.post('/', protect, submitApplication);

// Routes for viewing and updating applications (for admins only)
router.get('/', protect, admin, getApplications); // <-- Chain the middleware
router.put('/:id', protect, admin, updateApplicationStatus); // <-- Chain the middleware

export default router;