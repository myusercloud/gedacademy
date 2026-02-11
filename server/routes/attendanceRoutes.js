import express from "express";
const router = express.Router();

import {
  markAttendance,
  getStudentAttendance,
  getAttendanceSummary,
} from "../controllers/attendanceController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Teacher marks attendance
router.post(
  "/",
  auth,
  roleCheck("teacher", "admin"),
  asyncHandler(markAttendance)
);

// Attendance for a student (teacher, admin, student, or parent)
router.get(
  "/student/:studentId",
  auth,
  asyncHandler(getStudentAttendance)
);

// Attendance summary for a class (teacher or admin)
router.get(
  "/class/:classId/summary",
  auth,
  roleCheck("teacher", "admin"),
  asyncHandler(getAttendanceSummary)
);

export default router;
