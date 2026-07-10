const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, username, role, action, details, req) => {
  try {
    let ipAddress = '';
    if (req) {
      ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    }
    await ActivityLog.create({
      user: userId,
      username,
      role,
      action,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error('Error logging activity:', error.message);
  }
};

module.exports = { logActivity };
