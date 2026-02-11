const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(auth, roleCheck('admin'));

router.get('/', asyncHandler(getUsers));
router.get('/:id', asyncHandler(getUserById));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

module.exports = router;

