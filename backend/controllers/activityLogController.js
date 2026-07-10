const ActivityLog = require('../models/ActivityLog');

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private (Admin Only)
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
