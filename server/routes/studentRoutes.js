import express from "express";
const router = express.Router();

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin manages students
router.use(auth, roleCheck("admin"));

router.post("/", asyncHandler(createStudent));
router.get("/", asyncHandler(getStudents));
router.get("/:id", asyncHandler(getStudentById));
router.put("/:id", asyncHandler(updateStudent));
router.delete("/:id", asyncHandler(deleteStudent));

export default router;
