const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Please add a roll number'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    department: {
      type: String,
      required: [true, 'Please specify the department'],
      enum: ['Computer Science', 'Information Technology', 'Electronics & Comm', 'Mechanical', 'Civil', 'Electrical'],
    },
    batchYear: {
      type: Number,
      required: [true, 'Please specify the batch year'],
    },
    semester: {
      type: Number,
      required: [true, 'Please specify the current semester (1-8)'],
      min: 1,
      max: 8,
    },
    gender: {
      type: String,
      required: [true, 'Please select gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    cgpa: {
      type: Number,
      required: [true, 'Please add CGPA'],
      min: 0,
      max: 10,
      default: 0,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    qrCode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for high performance search
studentSchema.index({ fullName: 'text', rollNumber: 'text' });

module.exports = mongoose.model('Student', studentSchema);
