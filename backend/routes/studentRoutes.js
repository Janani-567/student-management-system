const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(protect, getStudents)
  .post(protect, authorize('admin'), upload.single('profilePhoto'), createStudent);

router
  .route('/:id')
  .get(protect, getStudent)
  .put(protect, upload.single('profilePhoto'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

module.exports = router;
