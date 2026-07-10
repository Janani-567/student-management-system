const express = require('express');
const router = express.Router();
const {
  getAttendance,
  recordAttendance,
  bulkRecordAttendance,
  getStudentReport,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getAttendance)
  .post(protect, authorize('admin', 'faculty'), recordAttendance);

router.post('/bulk', protect, authorize('admin', 'faculty'), bulkRecordAttendance);
router.get('/report/:studentId', protect, getStudentReport);

module.exports = router;
