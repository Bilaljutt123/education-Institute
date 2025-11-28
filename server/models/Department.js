// models/Department.js

import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    unique: false,
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Please add a department code'],
    unique: false,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a department description'],
    trim: true,
  },
  head: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Department', DepartmentSchema);
