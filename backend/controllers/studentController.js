const Student = require('../models/Student');
const User = require('../models/User');
const QRCode = require('qrcode');
const { logActivity } = require('../config/logger');

// Helper to generate profile URL and render to DataURI QR Code
const generateQRCode = async (studentId) => {
  try {
    // Generate a QR code that holds student ID or direct profile JSON summary
    const qrData = JSON.stringify({
      studentId: studentId.toString(),
      domain: 'edusphere-pro.system',
      timestamp: new Date().toISOString(),
    });
    return await QRCode.toDataURL(qrData);
  } catch (err) {
    console.error('QR Code Generation failed', err);
    return '';
  }
};

// @desc    Get all students (with advanced search & filter parameters)
// @route   GET /api/students
// @access  Private (Admin, Faculty, Student)
exports.getStudents = async (req, res) => {
  try {
    const { name, rollNumber, department, semester, batchYear, minCgpa, maxCgpa } = req.query;
    let query = {};

    if (name) {
      query.fullName = { $regex: name, $options: 'i' };
    }
    if (rollNumber) {
      query.rollNumber = { $regex: rollNumber, $options: 'i' };
    }
    if (department) {
      query.department = department;
    }
    if (semester) {
      query.semester = Number(semester);
    }
    if (batchYear) {
      query.batchYear = Number(batchYear);
    }
    
    // CGPA range filter
    if (minCgpa || maxCgpa) {
      query.cgpa = {};
      if (minCgpa) query.cgpa.$gte = Number(minCgpa);
      if (maxCgpa) query.cgpa.$lte = Number(maxCgpa);
    }

    const students = await Student.find(query).sort({ rollNumber: 1 });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', '-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create student profile
// @route   POST /api/students
// @access  Private (Admin)
exports.createStudent = async (req, res) => {
  try {
    const {
      fullName,
      rollNumber,
      email,
      phoneNumber,
      department,
      batchYear,
      semester,
      gender,
      cgpa,
      address,
      username,
      password,
    } = req.body;

    // Check if roll number or email exists
    const studentExists = await Student.findOne({ $or: [{ rollNumber }, { email }] });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student with this Roll Number or Email already exists' });
    }

    // 1. Create a corresponding User account first
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User account with this email/username already exists' });
    }

    const user = await User.create({
      username: username || rollNumber,
      email,
      password: password || '123456', // default password
      role: 'student',
    });

    // Handle profile photo path if uploaded
    let profilePhoto = '';
    if (req.file) {
      profilePhoto = `/uploads/profiles/${req.file.filename}`;
    }

    // 2. Create Student profile
    let student = new Student({
      user: user._id,
      fullName,
      rollNumber,
      email,
      phoneNumber,
      department,
      batchYear: Number(batchYear),
      semester: Number(semester),
      gender,
      cgpa: Number(cgpa),
      address,
      profilePhoto,
    });

    // 3. Generate QR Code
    student.qrCode = await generateQRCode(student._id);
    await student.save();

    await logActivity(req.user._id, req.user.username, req.user.role, 'STUDENT_CREATE', `Created student profile for ${fullName} (${rollNumber})`, req);

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private (Admin, Faculty, Owner Student)
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Authorization check: Admin, Faculty, or the Student themselves
    if (req.user.role === 'student' && student.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access Denied: You can only edit your own profile' });
    }

    const fieldsToUpdate = { ...req.body };
    
    // Don't let non-admins change vital parameters like CGPA, rollNumber, or Department
    if (req.user.role === 'student') {
      delete fieldsToUpdate.cgpa;
      delete fieldsToUpdate.rollNumber;
      delete fieldsToUpdate.department;
      delete fieldsToUpdate.semester;
      delete fieldsToUpdate.batchYear;
      delete fieldsToUpdate.user;
    }

    // If new profile picture uploaded
    if (req.file) {
      fieldsToUpdate.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    }

    student = await Student.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // Regenerate QR Code in case details changed
    student.qrCode = await generateQRCode(student._id);
    await student.save();

    await logActivity(req.user._id, req.user.username, req.user.role, 'STUDENT_UPDATE', `Updated student profile of ${student.fullName} (${student.rollNumber})`, req);

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete student profile and associated user login account
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete associated login user account
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    await logActivity(req.user._id, req.user.username, req.user.role, 'STUDENT_DELETE', `Deleted student profile & credentials of ${student.fullName} (${student.rollNumber})`, req);

    res.status(200).json({ success: true, message: 'Student profile & credentials deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
