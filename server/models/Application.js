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
    // REMOVED unique: true to allow multiple applications per student
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
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Please select a department'],
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
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