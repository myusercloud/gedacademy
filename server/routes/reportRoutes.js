import express from "express";
const router = express.Router();

import {
  getStudentReportJson,
  getStudentReportPdf,
  getAttendanceSummaryForStudent,
  getFeesStatementForStudent,
} from "../controllers/reportController.js";

import { auth } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Student report card JSON + PDF
router.get(
  "/students/:studentId/exams/:examId/json",
  auth,
  asyncHandler(getStudentReportJson)
);

router.get(
  "/students/:studentId/exams/:examId/pdf",
  auth,
  asyncHandler(getStudentReportPdf)
);

// Attendance summary
router.get(
  "/students/:studentId/attendance",
  auth,
  asyncHandler(getAttendanceSummaryForStudent)
);

// Fees statement
router.get(
  "/students/:studentId/fees",
  auth,
  asyncHandler(getFeesStatementForStudent)
);

export default router;
