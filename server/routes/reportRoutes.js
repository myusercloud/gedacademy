const express = require('express');
const router = express.Router();

const {
  getStudentReportJson,
  getStudentReportPdf,
  getAttendanceSummaryForStudent,
  getFeesStatementForStudent,
} = require('../controllers/reportController');
const { auth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Student report card JSON + PDF
router.get(
  '/students/:studentId/exams/:examId/json',
  auth,
  asyncHandler(getStudentReportJson)
);
router.get(
  '/students/:studentId/exams/:examId/pdf',
  auth,
  asyncHandler(getStudentReportPdf)
);

// Attendance summary
router.get(
  '/students/:studentId/attendance',
  auth,
  asyncHandler(getAttendanceSummaryForStudent)
);

// Fees statement
router.get(
  '/students/:studentId/fees',
  auth,
  asyncHandler(getFeesStatementForStudent)
);

module.exports = router;

