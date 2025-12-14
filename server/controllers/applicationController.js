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

    const { courses, department, ...commonData } = req.body;
    const studentId = req.user.id;

    // Check if student has any active (pending/accepted) applications in a different department
    const existingActiveApp = await Application.findOne({
      student: studentId,
      status: { $ne: 'rejected' }
    }).populate('department');

    if (existingActiveApp) {
      if (existingActiveApp.department._id.toString() !== department) {
        return res.status(400).json({ 
          msg: `You have an active application in the ${existingActiveApp.department.name} department. You cannot apply to other departments.` 
        });
      }
    }

    // If courses is an array, create an application for each course
    if (Array.isArray(courses) && courses.length > 0) {
      const applicationPromises = courses.map(courseId => {
        const applicationData = {
          ...commonData,
          department,
          student: studentId,
          courses: [courseId] // Store as single-item array to match schema
        };
        return new Application(applicationData).save();
      });

      const createdApplications = await Promise.all(applicationPromises);
      return res.status(201).json({ success: true, data: createdApplications });
    }

    // Fallback for single course or no course (though validation should catch no course)
    const applicationData = { ...req.body, student: studentId };
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
    const applications = await Application.find()
      .populate('student', 'name email address emergencyContact')
      .populate('department', 'name code')
      .populate('courses', 'title code');
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

// @desc    Get ALL applications for the logged-in student
// @route   GET /api/applications/me OR /api/applications/my-applications
// @access  Private (Student)
export const getMyApplication = async (req, res) => {
  try {
    // Find ALL applications where the 'student' field matches the logged-in user's ID
    const applications = await Application.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('department', 'name code')
      .populate('courses', 'title code');

    // Return empty array if no applications found (instead of 404)
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private (Admin only)
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};