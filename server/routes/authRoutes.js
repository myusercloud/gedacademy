import express from "express";
const router = express.Router();

import {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";

import { auth } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", auth, asyncHandler(logout));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPassword));
router.get("/me", auth, asyncHandler(getMe));

export default router;
