const express = require('express');
const router = express.Router();
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getFaculty)
  .post(protect, authorize('admin'), createFaculty);

router
  .route('/:id')
  .put(protect, updateFaculty)
  .delete(protect, authorize('admin'), deleteFaculty);

module.exports = router;
