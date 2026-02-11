import express from "express";
const router = express.Router();

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Only admin can manage users
router.use(auth, roleCheck("admin"));

router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUserById));
router.put("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

export default router;
