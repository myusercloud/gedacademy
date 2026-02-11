const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getConversation,
  getInbox,
} = require('../controllers/messageController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Authenticated teacher or parent messaging
router.use(auth, roleCheck('teacher', 'parent', 'admin'));

router.post('/', asyncHandler(sendMessage));
router.get('/inbox', asyncHandler(getInbox));
router.get('/conversation/:otherUserId', asyncHandler(getConversation));

module.exports = router;

