import express from "express";
const router = express.Router();

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin manages subjects
router.use(auth, roleCheck("admin"));

router.post("/", asyncHandler(createSubject));
router.get("/", asyncHandler(getSubjects));
router.get("/:id", asyncHandler(getSubjectById));
router.put("/:id", asyncHandler(updateSubject));
router.delete("/:id", asyncHandler(deleteSubject));

export default router;
