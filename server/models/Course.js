// models/Course.js

import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  duration: {
    type: String, // e.g., "3 Months", "6 Weeks"
    required: [true, 'Please add a course duration'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition fee'],
  },
  // You could add more fields like instructor, schedule, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Course', CourseSchema);