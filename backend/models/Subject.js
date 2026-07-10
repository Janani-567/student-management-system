const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
    },
    subjectCode: {
      type: String,
      required: [true, 'Please add a subject code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Please specify the department'],
      enum: ['Computer Science', 'Information Technology', 'Electronics & Comm', 'Mechanical', 'Civil', 'Electrical'],
    },
    semester: {
      type: Number,
      required: [true, 'Please specify the semester (1-8)'],
      min: 1,
      max: 8,
    },
    credits: {
      type: Number,
      required: [true, 'Please add subject credits'],
      min: 1,
      max: 6,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null,
    },
    facultyNameText: {
      type: String,
      required: [true, 'Please add a faculty name'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subject', subjectSchema);
