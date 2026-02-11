const express = require('express');
const router = express.Router();

const Settings = require('../models/Settings');
const upload = require('../utils/upload');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Public CMS content
router.get('/public', asyncHandler(async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings?.cms || {});
}));

// Admin updates CMS content
router.put(
  '/',
  auth,
  roleCheck('admin'),
  asyncHandler(async (req, res) => {
    const { cms } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      { cms },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(settings.cms);
  })
);

// Gallery image upload
router.post(
  '/gallery',
  auth,
  roleCheck('admin'),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const fileUrl = `/uploads/gallery/${req.file.filename}`;
    const { title, category } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      {
        $push: {
          'cms.gallery': { title, imageUrl: fileUrl, category },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      item: settings.cms.gallery[settings.cms.gallery.length - 1],
    });
  })
);

module.exports = router;

