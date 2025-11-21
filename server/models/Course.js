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
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'Please add a course duration'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition fee'],
  },
  instructor: {
    type: String,
    trim: true,
  },
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Course', CourseSchema);