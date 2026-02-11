const express = require('express');
const router = express.Router();

const {
  createFeeRecord,
  getFeesByStudent,
  initiateMpesaPayment,
  mpesaCallback,
} = require('../controllers/feeController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin manages fees
router.post('/', auth, roleCheck('admin'), asyncHandler(createFeeRecord));

// Fees for a student (admin, teacher, student, parent)
router.get(
  '/student/:studentId',
  auth,
  asyncHandler(getFeesByStudent)
);

// Initiate MPesa STK push (admin or parent)
router.post(
  '/mpesa/initiate',
  auth,
  roleCheck('admin', 'parent'),
  asyncHandler(initiateMpesaPayment)
);

// MPesa callback (public endpoint)
router.post('/mpesa/callback', asyncHandler(mpesaCallback));

module.exports = router;

