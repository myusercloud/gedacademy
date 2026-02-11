import express from "express";
const router = express.Router();

import {
  createTimetable,
  getTimetablesByClass,
  updateTimetable,
  deleteTimetable,
} from "../controllers/timetableController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin and teachers manage timetables
router.post(
  "/",
  auth,
  roleCheck("admin", "teacher"),
  asyncHandler(createTimetable)
);

router.get(
  "/class/:classId",
  auth,
  asyncHandler(getTimetablesByClass)
);

router.put(
  "/:id",
  auth,
  roleCheck("admin", "teacher"),
  asyncHandler(updateTimetable)
);

router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  asyncHandler(deleteTimetable)
);

export default router;
