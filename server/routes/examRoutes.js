import express from "express";
const router = express.Router();

import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin and teachers manage exams
router.post("/", auth, roleCheck("admin", "teacher"), asyncHandler(createExam));
router.get("/", auth, asyncHandler(getExams));
router.get("/:id", auth, asyncHandler(getExamById));
router.put(
  "/:id",
  auth,
  roleCheck("admin", "teacher"),
  asyncHandler(updateExam)
);
router.delete("/:id", auth, roleCheck("admin"), asyncHandler(deleteExam));

export default router;
