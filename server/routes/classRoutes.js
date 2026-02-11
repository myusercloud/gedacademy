import express from "express";
const router = express.Router();

import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin manages classes
router.use(auth, roleCheck("admin"));

router.post("/", asyncHandler(createClass));
router.get("/", asyncHandler(getClasses));
router.get("/:id", asyncHandler(getClassById));
router.put("/:id", asyncHandler(updateClass));
router.delete("/:id", asyncHandler(deleteClass));

export default router;
