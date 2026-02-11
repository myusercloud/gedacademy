const express = require('express');
const router = express.Router();

const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require('../controllers/classController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin manages classes
router.use(auth, roleCheck('admin'));

router.post('/', asyncHandler(createClass));
router.get('/', asyncHandler(getClasses));
router.get('/:id', asyncHandler(getClassById));
router.put('/:id', asyncHandler(updateClass));
router.delete('/:id', asyncHandler(deleteClass));

module.exports = router;

