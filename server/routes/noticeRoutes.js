import express from "express";
const router = express.Router();

import {
  createNotice,
  getNotices,
  deleteNotice,
} from "../controllers/noticeController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Public / role-filtered notices
router.get("/", asyncHandler(getNotices));

// Admin creates/deletes notices
router.post("/", auth, roleCheck("admin"), asyncHandler(createNotice));
router.delete("/:id", auth, roleCheck("admin"), asyncHandler(deleteNotice));

export default router;
