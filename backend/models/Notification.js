const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a notification title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add notification message'],
    },
    type: {
      type: String,
      enum: ['Academic', 'Exam', 'Alert', 'General'],
      default: 'General',
    },
    targetRole: {
      type: String,
      enum: ['all', 'faculty', 'student'],
      default: 'all',
    },
    department: {
      type: String,
      default: 'all', // can restrict to specific department
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
