import express from "express";
const router = express.Router();

import { getOverview } from "../controllers/dashboardController.js";
import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

router.get(
  "/",
  auth,
  roleCheck("admin"),
  asyncHandler(getOverview)
);

export default router;
