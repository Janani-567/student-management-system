const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const { logActivity } = require('../config/logger');

// @desc    Get attendance logs
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date } = req.query;
    let query = {};

    if (studentId) query.student = studentId;
    if (subjectId) query.subject = subjectId;
    if (date) {
      const searchDate = new Date(date);
      searchDate.setUTCHours(0, 0, 0, 0);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);

      query.date = {
        $gte: searchDate,
        $lt: nextDate,
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'fullName rollNumber department semester')
      .populate('subject', 'subjectName subjectCode');

    res.status(200).json({ success: true, count: attendanceRecords.length, data: attendanceRecords });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Record or Update single student attendance
// @route   POST /api/attendance
// @access  Private (Admin, Faculty)
exports.recordAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status } = req.body;

    if (!studentId || !subjectId || !status) {
      return res.status(400).json({ success: false, message: 'Please provide studentId, subjectId, and status' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setUTCHours(0, 0, 0, 0);

    // Upsert behavior using student/subject/date
    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, subject: subjectId, date: attendanceDate },
      { status, recordedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Bulk record attendance for list of students
// @route   POST /api/attendance/bulk
// @access  Private (Admin, Faculty)
exports.bulkRecordAttendance = async (req, res) => {
  try {
    const { subjectId, date, records } = req.body; // records: [{studentId, status}]

    if (!subjectId || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Please provide subjectId and records array' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const operations = records.map((record) => ({
      updateOne: {
        filter: { student: record.studentId, subject: subjectId, date: attendanceDate },
        update: { status: record.status, recordedBy: req.user._id },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    await logActivity(req.user._id, req.user.username, req.user.role, 'ATTENDANCE_BULK_RECORD', `Recorded bulk attendance for subject ID: ${subjectId}`, req);

    res.status(200).json({ success: true, message: 'Bulk attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get attendance report card for a single student
// @route   GET /api/attendance/report/:studentId
// @access  Private
exports.getStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get all classes recorded for this student
    const attendanceLogs = await Attendance.find({ student: studentId }).populate('subject', 'subjectName subjectCode credits');

    // Aggregate by subject
    const subjectWiseMap = {};

    attendanceLogs.forEach((record) => {
      const subId = record.subject._id.toString();
      if (!subjectWiseMap[subId]) {
        subjectWiseMap[subId] = {
          subjectName: record.subject.subjectName,
          subjectCode: record.subject.subjectCode,
          credits: record.subject.credits,
          total: 0,
          present: 0,
        };
      }
      subjectWiseMap[subId].total += 1;
      if (record.status === 'Present') {
        subjectWiseMap[subId].present += 1;
      }
    });

    const report = Object.keys(subjectWiseMap).map((key) => {
      const item = subjectWiseMap[key];
      const percentage = item.total > 0 ? Number(((item.present / item.total) * 100).toFixed(2)) : 0;
      return {
        subjectId: key,
        ...item,
        percentage,
        alert: percentage < 75, // Low attendance flag
      };
    });

    // Overall aggregate
    let totalClasses = 0;
    let totalPresent = 0;
    report.forEach((sub) => {
      totalClasses += sub.total;
      totalPresent += sub.present;
    });
    const overallPercentage = totalClasses > 0 ? Number(((totalPresent / totalClasses) * 100).toFixed(2)) : 0;

    res.status(200).json({
      success: true,
      data: {
        student: {
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          department: student.department,
          semester: student.semester,
        },
        overallPercentage,
        totalClasses,
        totalPresent,
        subjectWiseReport: report,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
