const express = require('express');
const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
  getAttendanceSummary,
} = require('../controllers/attendanceController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Teacher marks attendance
router.post(
  '/',
  auth,
  roleCheck('teacher', 'admin'),
  asyncHandler(markAttendance)
);

// Attendance for a student (teacher, admin, student themselves, or parent)
router.get(
  '/student/:studentId',
  auth,
  asyncHandler(getStudentAttendance)
);

// Attendance summary for class (teacher or admin)
router.get(
  '/class/:classId/summary',
  auth,
  roleCheck('teacher', 'admin'),
  asyncHandler(getAttendanceSummary)
);

module.exports = router;

