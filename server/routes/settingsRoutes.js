import express from "express";
const router = express.Router();

import {
  getSettings,
  upsertSettings,
} from "../controllers/settingsController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Public settings (e.g., school profile)
router.get("/public", asyncHandler(getSettings));

// Admin updates settings
router.put(
  "/",
  auth,
  roleCheck("admin"),
  asyncHandler(upsertSettings)
);

export default router;
