import express from "express";
const router = express.Router();

import {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
} from "../controllers/parentController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin manages parents
router.use(auth, roleCheck("admin"));

router.post("/", asyncHandler(createParent));
router.get("/", asyncHandler(getParents));
router.get("/:id", asyncHandler(getParentById));
router.put("/:id", asyncHandler(updateParent));
router.delete("/:id", asyncHandler(deleteParent));

export default router;
