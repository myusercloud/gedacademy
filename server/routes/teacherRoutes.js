import express from "express";
const router = express.Router();

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin manages teachers
router.use(auth, roleCheck("admin"));

router.post("/", asyncHandler(createTeacher));
router.get("/", asyncHandler(getTeachers));
router.get("/:id", asyncHandler(getTeacherById));
router.put("/:id", asyncHandler(updateTeacher));
router.delete("/:id", asyncHandler(deleteTeacher));

export default router;
