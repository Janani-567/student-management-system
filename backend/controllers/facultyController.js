const Faculty = require('../models/Faculty');
const User = require('../models/User');
const { logActivity } = require('../config/logger');

// @desc    Get all faculty members
// @route   GET /api/faculty
// @access  Private
exports.getFaculty = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};
    if (department) query.department = department;

    const facultyList = await Faculty.find(query).populate('assignedSubjects');
    res.status(200).json({ success: true, count: facultyList.length, data: facultyList });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create faculty profile and login account
// @route   POST /api/faculty
// @access  Private (Admin)
exports.createFaculty = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, department, designation, username, password } = req.body;

    const facultyExists = await Faculty.findOne({ email });
    if (facultyExists) {
      return res.status(400).json({ success: false, message: 'Faculty member with this email already exists' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User credentials already exists for this email/username' });
    }

    // 1. Create credential user
    const user = await User.create({
      username: username || email.split('@')[0],
      email,
      password: password || '123456',
      role: 'faculty',
    });

    // 2. Create Faculty record
    const faculty = await Faculty.create({
      user: user._id,
      fullName,
      email,
      phoneNumber,
      department,
      designation,
      assignedSubjects: [],
    });

    await logActivity(req.user._id, req.user.username, req.user.role, 'FACULTY_CREATE', `Created faculty profile for ${fullName}`, req);

    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
// @access  Private (Admin, Owner Faculty)
exports.updateFaculty = async (req, res) => {
  try {
    let faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }

    // Auth check
    if (req.user.role === 'faculty' && faculty.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit other faculty profiles' });
    }

    const fieldsToUpdate = { ...req.body };
    if (req.user.role === 'faculty') {
      delete fieldsToUpdate.department;
      delete fieldsToUpdate.assignedSubjects;
      delete fieldsToUpdate.user;
    }

    faculty = await Faculty.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    await logActivity(req.user._id, req.user.username, req.user.role, 'FACULTY_UPDATE', `Updated faculty profile for ${faculty.fullName}`, req);

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete faculty profile & login credentials
// @route   DELETE /api/faculty/:id
// @access  Private (Admin)
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    // Delete credentials
    await User.findByIdAndDelete(faculty.user);
    await Faculty.findByIdAndDelete(req.params.id);

    await logActivity(req.user._id, req.user.username, req.user.role, 'FACULTY_DELETE', `Deleted faculty profile and credentials for ${faculty.fullName}`, req);

    res.status(200).json({ success: true, message: 'Faculty profile & credentials deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
