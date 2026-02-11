const express = require('express');
const router = express.Router();

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require('../controllers/examController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin and teachers manage exams
router.post('/', auth, roleCheck('admin', 'teacher'), asyncHandler(createExam));
router.get('/', auth, asyncHandler(getExams));
router.get('/:id', auth, asyncHandler(getExamById));
router.put('/:id', auth, roleCheck('admin', 'teacher'), asyncHandler(updateExam));
router.delete('/:id', auth, roleCheck('admin'), asyncHandler(deleteExam));

module.exports = router;

