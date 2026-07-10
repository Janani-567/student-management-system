const express = require('express');
const router = express.Router();
const { exportStudentPDF, exportStudentsExcel } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/pdf/student/:id', protect, exportStudentPDF);
router.get('/excel/students', protect, authorize('admin', 'faculty'), exportStudentsExcel);

module.exports = router;
