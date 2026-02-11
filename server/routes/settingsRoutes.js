const express = require('express');
const router = express.Router();

const {
  getSettings,
  upsertSettings,
} = require('../controllers/settingsController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Public settings (e.g., school profile)
router.get('/public', asyncHandler(getSettings));

// Admin updates settings
router.put(
  '/',
  auth,
  roleCheck('admin'),
  asyncHandler(upsertSettings)
);

module.exports = router;

