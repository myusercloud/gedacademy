const express = require('express');
const router = express.Router();

const { getOverview } = require('../controllers/dashboardController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

router.get(
  '/',
  auth,
  roleCheck('admin'),
  asyncHandler(getOverview)
);

module.exports = router;

