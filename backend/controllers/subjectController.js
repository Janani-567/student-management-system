const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const { logActivity } = require('../config/logger');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query;
    let query = {};

    if (department) query.department = department;
    if (semester) query.semester = Number(semester);

    const subjects = await Subject.find(query).populate('faculty');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private (Admin)
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, department, semester, credits, facultyId, facultyNameText } = req.body;

    const subjectExists = await Subject.findOne({ subjectCode: subjectCode.toUpperCase() });
    if (subjectExists) {
      return res.status(400).json({ success: false, message: 'Subject with this Subject Code already exists' });
    }

    let facultyObjId = null;
    if (facultyId) {
      const faculty = await Faculty.findById(facultyId);
      if (faculty) facultyObjId = faculty._id;
    }

    const subject = await Subject.create({
      subjectName,
      subjectCode: subjectCode.toUpperCase(),
      department,
      semester: Number(semester),
      credits: Number(credits),
      faculty: facultyObjId,
      facultyNameText: facultyNameText || 'TBD',
    });

    // If faculty was matched, push this subject into their assignedSubjects array
    if (facultyObjId) {
      await Faculty.findByIdAndUpdate(facultyObjId, { $addToSet: { assignedSubjects: subject._id } });
    }

    await logActivity(req.user._id, req.user.username, req.user.role, 'SUBJECT_CREATE', `Created subject ${subjectName} (${subjectCode})`, req);

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
exports.updateSubject = async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const { subjectName, subjectCode, department, semester, credits, facultyId, facultyNameText } = req.body;

    // Handle shifting faculty assignment if changed
    if (facultyId && facultyId !== String(subject.faculty)) {
      // remove from old faculty
      if (subject.faculty) {
        await Faculty.findByIdAndUpdate(subject.faculty, { $pull: { assignedSubjects: subject._id } });
      }
      // add to new faculty
      const newFaculty = await Faculty.findById(facultyId);
      if (newFaculty) {
        await Faculty.findByIdAndUpdate(facultyId, { $addToSet: { assignedSubjects: subject._id } });
        subject.faculty = newFaculty._id;
      }
    }

    subject.subjectName = subjectName || subject.subjectName;
    subject.subjectCode = subjectCode ? subjectCode.toUpperCase() : subject.subjectCode;
    subject.department = department || subject.department;
    subject.semester = semester ? Number(semester) : subject.semester;
    subject.credits = credits ? Number(credits) : subject.credits;
    subject.facultyNameText = facultyNameText || subject.facultyNameText;

    await subject.save();

    await logActivity(req.user._id, req.user.username, req.user.role, 'SUBJECT_UPDATE', `Updated subject ${subject.subjectName} (${subject.subjectCode})`, req);

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Pull from faculty assigned list
    if (subject.faculty) {
      await Faculty.findByIdAndUpdate(subject.faculty, { $pull: { assignedSubjects: subject._id } });
    }

    await Subject.findByIdAndDelete(req.params.id);

    await logActivity(req.user._id, req.user.username, req.user.role, 'SUBJECT_DELETE', `Deleted subject ${subject.subjectName} (${subject.subjectCode})`, req);

    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
