const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getNotifications)
  .post(protect, authorize('admin', 'faculty'), createNotification);

router.route('/:id').delete(protect, authorize('admin', 'faculty'), deleteNotification);

module.exports = router;
