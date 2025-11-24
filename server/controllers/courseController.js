// controllers/courseController.js

import Course from '../models/Course.js';
import Application from '../models/Application.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (or Private if you want to restrict it)
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run model validation on update
    });

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    // Delete all applications associated with this course
    // Note: Applications store the course title in 'desiredCourse'
    await Application.deleteMany({ desiredCourse: course.title });

    res.status(200).json({ success: true, data: {} }); // Or send a success message
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};