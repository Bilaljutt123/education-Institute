import GPA from '../models/GPA.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

// @desc    Add or Update GPA for a student
// @route   POST /api/gpa
// @access  Private/Admin
export const addOrUpdateGPA = async (req, res) => {
  try {
    const { studentId, departmentId, semester, gpa } = req.body;

    // Validate input
    if (!studentId || !departmentId || !semester || gpa === undefined) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Upsert GPA record
    const gpaRecord = await GPA.findOneAndUpdate(
      { student: studentId, department: departmentId, semester },
      { gpa },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: gpaRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get GPA records for a student
// @route   GET /api/gpa/student/:studentId
// @access  Private (Admin or the Student themselves)
export const getStudentGPA = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Authorization check: Only admin or the student themselves can view
    if (req.user.role !== 'admin' && req.user._id.toString() !== studentId) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this record' });
    }

    // Fetch GPA records
    const gpaRecords = await GPA.find({ student: studentId })
      .populate('department', 'name code')
      .sort({ semester: 1 });

    res.status(200).json({ success: true, data: gpaRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all GPA records (for admin overview if needed)
// @route   GET /api/gpa
// @access  Private/Admin
export const getAllGPAs = async (req, res) => {
  try {
    const gpas = await GPA.find()
      .populate('student', 'name email')
      .populate('department', 'name');
    res.status(200).json({ success: true, data: gpas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
