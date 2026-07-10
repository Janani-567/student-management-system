const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const Attendance = require('../models/Attendance');

// @desc    Get dashboard metrics & interactive chart aggregations
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Core counters
    const totalStudents = await Student.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalFaculty = await Faculty.countDocuments();

    // 2. Average CGPA
    const avgCgpaAggregate = await Student.aggregate([
      { $group: { _id: null, avgCgpa: { $avg: '$cgpa' } } }
    ]);
    const averageCgpa = avgCgpaAggregate.length > 0 ? Number(avgCgpaAggregate[0].avgCgpa.toFixed(2)) : 0;

    // 3. Department-wise student distribution
    const deptDistribution = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 }, avgCgpa: { $avg: '$cgpa' } } },
      { $project: { department: '$_id', count: 1, avgCgpa: { $round: ['$avgCgpa', 2] }, _id: 0 } }
    ]);

    // 4. Top performing students (CGPA > 9 or top 5 rankers)
    const topPerformers = await Student.find()
      .sort({ cgpa: -1 })
      .limit(5)
      .select('fullName rollNumber department semester cgpa profilePhoto');

    // 5. Semester-wise stats
    const semDistribution = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 }, avgCgpa: { $avg: '$cgpa' } } },
      { $project: { semester: '$_id', count: 1, avgCgpa: { $round: ['$avgCgpa', 2] }, _id: 0 } },
      { $sort: { semester: 1 } }
    ]);

    // 6. Alert: Low attendance students (< 75% overall)
    // For high speed demo dashboard statistics, query attendance records
    const attendanceAgg = await Attendance.aggregate([
      {
        $group: {
          _id: { student: '$student', status: '$status' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.student',
          records: { $push: { status: '$_id.status', count: '$count' } },
        },
      },
    ]);

    let lowAttendanceCount = 0;
    const lowAttendanceList = [];

    // Resolve details for students with low attendance
    for (const record of attendanceAgg) {
      let present = 0;
      let total = 0;
      record.records.forEach((r) => {
        total += r.count;
        if (r.status === 'Present') {
          present += r.count;
        }
      });
      const pct = total > 0 ? (present / total) * 100 : 100;
      if (pct < 75) {
        lowAttendanceCount++;
        // Fetch brief profile details for list
        if (lowAttendanceList.length < 5) {
          const s = await Student.findById(record._id).select('fullName rollNumber department semester');
          if (s) {
            lowAttendanceList.push({
              id: s._id,
              fullName: s.fullName,
              rollNumber: s.rollNumber,
              department: s.department,
              semester: s.semester,
              percentage: Number(pct.toFixed(2)),
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        counters: {
          totalStudents,
          totalSubjects,
          totalFaculty,
          averageCgpa,
          lowAttendanceCount,
        },
        deptDistribution,
        semDistribution,
        topPerformers,
        lowAttendanceList,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
