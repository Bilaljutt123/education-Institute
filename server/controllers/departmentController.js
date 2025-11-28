// controllers/departmentController.js

import Department from '../models/Department.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ success: true, data: departments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Department not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description, head } = req.body;

    const department = new Department({
      name,
      code: code.toUpperCase(),
      description,
      head,
    });

    await department.save();
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res) => {
  try {
    const { name, code, description, head } = req.body;

    let department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (code) updateFields.code = code.toUpperCase();
    if (description) updateFields.description = description;
    if (head !== undefined) updateFields.head = head;

    department = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: department });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({ success: true, msg: 'Department removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
