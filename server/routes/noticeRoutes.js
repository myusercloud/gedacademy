const express = require('express');
const router = express.Router();

const {
  createNotice,
  getNotices,
  deleteNotice,
} = require('../controllers/noticeController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Public / role-filtered notices
router.get('/', asyncHandler(getNotices));

// Admin creates/deletes notices
router.post('/', auth, roleCheck('admin'), asyncHandler(createNotice));
router.delete('/:id', auth, roleCheck('admin'), asyncHandler(deleteNotice));

module.exports = router;

