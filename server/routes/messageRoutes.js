import express from "express";
const router = express.Router();

import {
  sendMessage,
  getConversation,
  getInbox,
} from "../controllers/messageController.js";

import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Authenticated teacher, parent, or admin messaging
router.use(auth, roleCheck("teacher", "parent", "admin"));

router.post("/", asyncHandler(sendMessage));
router.get("/inbox", asyncHandler(getInbox));
router.get("/conversation/:otherUserId", asyncHandler(getConversation));

export default router;
