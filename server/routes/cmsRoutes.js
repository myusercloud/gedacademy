import express from "express";
const router = express.Router();

import Settings from "../models/Settings.js";
import upload from "../utils/upload.js";
import { auth, roleCheck } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

// Public CMS content
router.get(
  "/public",
  asyncHandler(async (req, res) => {
    const settings = await Settings.findOne();
    res.json(settings?.cms || {});
  })
);

// Admin updates CMS content
router.put(
  "/",
  auth,
  roleCheck("admin"),
  asyncHandler(async (req, res) => {
    const { cms } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      { cms },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(settings.cms);
  })
);

// Gallery image upload
router.post(
  "/gallery",
  auth,
  roleCheck("admin"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const fileUrl = `/uploads/gallery/${req.file.filename}`;
    const { title, category } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      {
        $push: {
          "cms.gallery": { title, imageUrl: fileUrl, category },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      item: settings.cms.gallery[settings.cms.gallery.length - 1],
    });
  })
);

export default router;
