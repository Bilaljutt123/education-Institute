// controllers/applicationController.js

import Application from '../models/Application.js';
import User from '../models/User.js';

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Private (Student)
export const submitApplication = async (req, res) => {
  try {
    // First, get the full user to check their role
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Check if the user has already submitted an application
    const existingApplication = await Application.findOne({ student: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already submitted an application' });
    }

    const applicationData = { ...req.body, student: req.user.id };
    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all applications (for admin)
// @route   GET /api/applications
// @access  Private (Admin only)
export const getApplications = async (req, res) => {
  try {
    // We don't need to fetch the user here because the 'admin' middleware will have already run.
    const applications = await Application.find().populate('student', 'name email');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:id
// @access  Private (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedApplication });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get the logged-in student's own application
// @route   GET /api/applications/me
// @access  Private (Student)
export const getMyApplication = async (req, res) => {
  try {
    // Find the application where the 'student' field matches the logged-in user's ID
    const application = await Application.findOne({ student: req.user.id });

    if (!application) {
      // If no application is found, send a 404 with a clear message
      return res.status(404).json({ msg: 'You have not submitted an application yet.' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};