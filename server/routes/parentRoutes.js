const express = require('express');
const router = express.Router();

const {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
} = require('../controllers/parentController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin manages parents
router.use(auth, roleCheck('admin'));

router.post('/', asyncHandler(createParent));
router.get('/', asyncHandler(getParents));
router.get('/:id', asyncHandler(getParentById));
router.put('/:id', asyncHandler(updateParent));
router.delete('/:id', asyncHandler(deleteParent));

module.exports = router;

