const express = require('express');
const router = express.Router();

const {
  upsertResult,
  getResultsByStudent,
  getResultsByExam,
} = require('../controllers/resultController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Teachers enter marks
router.post('/', auth, roleCheck('teacher', 'admin'), asyncHandler(upsertResult));

// View results by student
router.get(
  '/student/:studentId',
  auth,
  asyncHandler(getResultsByStudent)
);

// View results by exam
router.get(
  '/exam/:examId',
  auth,
  roleCheck('teacher', 'admin'),
  asyncHandler(getResultsByExam)
);

module.exports = router;

