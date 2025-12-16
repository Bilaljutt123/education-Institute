
import express from 'express';
import StudentRequest from '../models/StudentRequest.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/requests
// @desc    Create a new request
// @access  Private (Student)
router.post('/', protect, async (req, res) => {
  try {
    const { type, title, description, startDate, endDate } = req.body;

    const request = new StudentRequest({
      student: req.user._id,
      type,
      title,
      description,
      startDate,
      endDate
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests/my
// @desc    Get logged in user's requests
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await StudentRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching my requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/requests
// @desc    Get all requests (Admin)
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const requests = await StudentRequest.find({}).populate('student', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/requests/:id
// @desc    Update request status (Admin)
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await StudentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
