import express from "express";
const router = express.Router();

import {
  createFeeRecord,
  getFeesByStudent,
  initiateMpesaPayment,
  mpesaCallback,
} from "../controllers/feeController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Admin manages fees
router.post("/", auth, roleCheck("admin"), asyncHandler(createFeeRecord));

// Fees for a student (admin, teacher, student, parent)
router.get("/student/:studentId", auth, asyncHandler(getFeesByStudent));

// Initiate MPesa STK push (admin or parent)
router.post(
  "/mpesa/initiate",
  auth,
  roleCheck("admin", "parent"),
  asyncHandler(initiateMpesaPayment)
);

// MPesa callback (public endpoint)
router.post("/mpesa/callback", asyncHandler(mpesaCallback));

export default router;
