// models/Application.js

import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  // Link to the user who submitted the application
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  // Academic Information
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add a date of birth'],
  },
  previousEducation: {
    type: String,
    required: [true, 'Please add your previous education'],
  },
  desiredCourse: {
    type: String,
    required: [true, 'Please add your desired course'],
  },
  // Application Status
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