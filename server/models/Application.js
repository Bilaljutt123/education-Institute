// models/Application.js

import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true],
  },
  firstName: {
    type: String,
    required: [true],
  },
  lastName: {
    type: String,
    required: [true],
  },
  email: {
    type: String,
    required: [true],
    unique: true,
  },
  phone: {
    type: String,
    required: [true],
  },
  dateOfBirth: {
    type: Date,
    required: [true],
  },
  previousEducation: {
    type: String,
    required: [true],
  },
  desiredCourse: {
    type: String,
    required: [true],
  },
  // Change this from a single string to an array of objects
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true],
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Application', ApplicationSchema);