const Notification = require('../models/Notification');
const { logActivity } = require('../config/logger');

// @desc    Get announcements/notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { type, department } = req.query;
    let query = {};

    // Filter based on user's login role
    if (req.user.role === 'student') {
      // Students see general, specific student targets, or overall targets
      query.targetRole = { $in: ['all', 'student'] };
    } else if (req.user.role === 'faculty') {
      query.targetRole = { $in: ['all', 'faculty'] };
    }

    if (type) query.type = type;
    
    // Filter by specific department if set (or all)
    if (department) {
      query.$or = [{ department: 'all' }, { department: department }];
    }

    const list = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new announcement
// @route   POST /api/notifications
// @access  Private (Admin, Faculty)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole, department } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'General',
      targetRole: targetRole || 'all',
      department: department || 'all',
      createdBy: req.user._id,
    });

    await logActivity(req.user._id, req.user.username, req.user.role, 'NOTIFICATION_CREATE', `Created notification: "${title}"`, req);

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin, Faculty creator)
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Auth check
    if (req.user.role !== 'admin' && notification.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
