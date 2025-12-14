import mongoose from 'mongoose';

const GPASchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8, // Assuming 8 semesters as per user description
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 4.0, // Assuming 4.0 scale
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a student has only one GPA per semester per department
GPASchema.index({ student: 1, department: 1, semester: 1 }, { unique: true });

export default mongoose.model('GPA', GPASchema);
