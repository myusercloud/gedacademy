import express from "express";
const router = express.Router();

import {
  upsertResult,
  getResultsByStudent,
  getResultsByExam,
} from "../controllers/resultController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Teachers enter marks
router.post(
  "/",
  auth,
  roleCheck("teacher", "admin"),
  asyncHandler(upsertResult)
);

// View results by student
router.get(
  "/student/:studentId",
  auth,
  asyncHandler(getResultsByStudent)
);

// View results by exam
router.get(
  "/exam/:examId",
  auth,
  roleCheck("teacher", "admin"),
  asyncHandler(getResultsByExam)
);

export default router;
